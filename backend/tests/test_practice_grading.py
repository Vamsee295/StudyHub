from app.api.routes.practice import AnswerIn, grade_attempt, public_question
from app.models.practice import PracticeQuestion

MCQ = PracticeQuestion(
    id="mcq", set_id="s", title="ACID", problem_statement="I in ACID?", difficulty="Easy",
    options=[{"id": "a", "text": "Integrity", "is_correct": False}, {"id": "b", "text": "Isolation", "is_correct": True}],
    correct_option="b", explanation="Isolation.",
)
OPEN = PracticeQuestion(
    id="open", set_id="s", title="Two Sum", problem_statement="...", difficulty="Easy",
    options=[], correct_option="", explanation="Use a HashMap.",
)


def test_public_question_hides_answer_key():
    q = public_question(MCQ)
    assert "correct_option" not in q and "explanation" not in q
    assert q["options"] == [{"id": "a", "text": "Integrity"}, {"id": "b", "text": "Isolation"}]


def test_grading_ignores_client_claims():
    score, graded = grade_attempt([MCQ, OPEN], {"mcq": AnswerIn(choice="a"), "open": AnswerIn(text="hashmap", self_solved=True)})
    assert score == 1
    assert graded["mcq"] == {"choice": "a", "is_correct": False, "graded_by": "auto"}
    assert graded["open"]["graded_by"] == "self" and graded["open"]["is_correct"]


def test_unanswered_questions_score_zero():
    score, graded = grade_attempt([MCQ, OPEN], {})
    assert score == 0 and not graded["mcq"]["is_correct"] and not graded["open"]["is_correct"]
