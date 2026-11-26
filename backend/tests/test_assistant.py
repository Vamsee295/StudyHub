"""AI routes with a stand-in provider: retrieval reaches the prompt, JSON shapes round-trip, limits hold."""
from fastapi.testclient import TestClient

import app.api.routes.assistant as assistant
from app.ai.rag import index
from app.core.security import get_current_user
from app.main import app


class _User:
    id = "assistant-test-user"


class _Fake:
    provider_name, default_model = "fake", "m"

    async def generate(self, messages, **_):
        assert "/learn/dsa/" in messages[0]["content"], "lesson material should be in the system prompt"
        return "See [Two Sum](/learn/dsa/two-sum-lesson)", {}

    async def structured_output(self, messages, schema, **_):
        if schema.__name__ == "ResumeResult":
            return schema(doc={"name": "A", "sections": [{"title": "Projects", "entries": [{"title": "X", "bullets": ["Built Y"]}]}]})
        return schema(options=["a", "b", "c", "d"])


def test_retrieval_finds_lessons_and_app_pages():
    assert index().search("round robin scheduling")[0].url.startswith("/learn/os/")
    assert index().search("where is the daily problem")[0].url == "/learn/daily"


def test_routes(monkeypatch):
    app.dependency_overrides[get_current_user] = lambda: _User()
    monkeypatch.setattr(assistant, "get_ai_provider", lambda: _Fake())
    assistant._calls.clear()
    c = TestClient(app)
    try:
        r = c.post("/api/ai/chat", json={"messages": [{"role": "user", "content": "two sum hash map"}]})
        assert r.status_code == 200 and r.json()["sources"]
        doc = {"name": "S", "sections": []}
        assert c.post("/api/ai/resume/build", json={"details": "B.Tech student at XYZ, built a todo app", "template": doc}).json()["doc"]["name"] == "A"
        assert c.post("/api/ai/resume/tailor", json={"doc": doc, "job": "Frontend developer"}).status_code == 200
        assert len(c.post("/api/ai/resume/bullet", json={"bullet": "made a website"}).json()["options"]) == 3
        codes = [c.post("/api/ai/resume/bullet", json={"bullet": "made a website"}).status_code for _ in range(assistant.MAX_CALLS)]
        assert codes[-1] == 429
    finally:
        app.dependency_overrides.pop(get_current_user, None)
        assistant._calls.clear()


def test_fallback_uses_one_provider_and_skips_a_failed_one():
    import asyncio

    from app.ai.provider.factory import FallbackProvider

    class P:
        def __init__(self, name, ok):
            self.provider_name, self.default_model, self.ok, self.calls = name, "m", ok, 0

        async def generate(self, messages, **_):
            self.calls += 1
            if not self.ok:
                raise RuntimeError("402 no credits")
            return self.provider_name, {}

    bad, good = P("ollama", False), P("groq", True)
    fb = FallbackProvider([bad, good])
    assert asyncio.run(fb.generate([])) == ("groq", {})  # primary failed, backup answered
    assert asyncio.run(fb.generate([])) == ("groq", {})
    assert bad.calls == 1, "a failed provider is skipped while it cools down"
    healthy_first = FallbackProvider([P("groq", True), P("ollama", True)])
    asyncio.run(healthy_first.generate([]))
    assert healthy_first.providers[1].calls == 0, "the backup is never called when the primary works"
