from fastapi.testclient import TestClient
from app.main import app
from app.core.security import get_current_user

class DummyUser:
    id = "c39dcf91-bdb4-48b3-ad3c-e910cc5d0041"
    email = "student@gmail.com"
    user_metadata = {}

app.dependency_overrides[get_current_user] = lambda: DummyUser()

client = TestClient(app)

endpoints = [
    '/api/roadmaps',
    '/api/resources',
    '/api/resources/history',
    '/api/practice/sets',
    '/api/practice/ledger',
    '/api/learn/subjects',
    '/api/learn/subjects/programming-fundamentals',
    '/api/learn/subjects/oop',
    '/api/learn/subjects/operating-systems',
    '/api/learn/subjects/dsa',
    '/api/learn/topics/variables-data-types',
    '/api/learn/topics/classes-objects',
    '/api/learn/topics/two-pointers'
]

for ep in endpoints:
    res = client.get(ep)
    print(f"[{res.status_code}] {ep}")

