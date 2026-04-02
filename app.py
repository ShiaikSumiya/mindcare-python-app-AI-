from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, render_template, request, session
from werkzeug.security import check_password_hash, generate_password_hash


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "mindcare.db"
MIN_AGE = 13
MAX_AGE = 25

THERAPIST_ACCOUNT = {
    "email": "therapist@mindcare.com",
    "password": "Therapist@123",
    "name": "Dr. Admin Therapist",
}

DEFAULT_KNOWLEDGE = [
    {
        "category": "Stress",
        "question": "I am feeling stressed",
        "answer": "Stress can feel overwhelming, especially for students. Start by slowing your breathing, picking one small task, and reminding yourself that you only need to take the next step, not solve everything right now.",
    },
    {
        "category": "Anxiety",
        "question": "I have anxiety",
        "answer": "Anxiety often becomes smaller when you ground yourself in the present moment. Try noticing 5 things you can see, 4 you can feel, and 3 you can hear while breathing slowly.",
    },
    {
        "category": "Depression",
        "question": "I feel depressed",
        "answer": "Low mood can make even simple things feel heavy. Be gentle with yourself, do one tiny caring action, and reach out to someone safe if you can.",
    },
    {
        "category": "Sleep",
        "question": "I cannot sleep",
        "answer": "Sleep problems can make everything harder. Keep your room cool and dark, avoid your phone before bed, and try breathing slowly while lying down.",
    },
    {
        "category": "Loneliness",
        "question": "I feel lonely",
        "answer": "Loneliness hurts, but it does not mean you are unwanted. One small social step like sending a message or joining a study group can help you feel less alone.",
    },
    {
        "category": "Academic",
        "question": "I am struggling with my studies",
        "answer": "When studies feel heavy, break the work into one short task, one short break, and one realistic goal for today. Progress matters more than perfection.",
    },
    {
        "category": "Coping",
        "question": "How can I feel better",
        "answer": "Focus on basics first: breathing, water, movement, rest, and one supportive conversation. Small actions can create real emotional change.",
    },
    {
        "category": "Crisis",
        "question": "I want to hurt myself",
        "answer": "If you may hurt yourself or someone else, please contact a trusted person, local emergency services, or a crisis helpline immediately. Real human support is the safest next step right now.",
    },
]

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("FLASK_SECRET_KEY", "mindcare-dev-secret")
app.config["JSON_SORT_KEYS"] = False


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def normalize(value: str) -> str:
    return value.strip().lower()


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def create_welcome_message() -> dict:
    return {
        "id": now_iso(),
        "role": "assistant",
        "createdAt": now_iso(),
        "text": (
            "This is a safe and private space. I will listen and support you without judgment. "
            "The panel on the right will analyze your session live and suggest personalized positive solutions. "
            "How are you feeling today?"
        ),
    }


def create_base_analysis() -> dict:
    return {
        "emoji": "🙂",
        "status": "Ready",
        "wellness": 100,
        "wellnessLabel": "Mood Stable",
        "accuracy": 0,
        "stress": 0,
        "anxiety": 0,
        "depression": 0,
        "loneliness": 0,
        "anger": 0,
        "alert": False,
        "riskLevel": "Low",
        "planTitle": "Support Plan",
        "summary": "Chat with the bot and your personalized suggestions will appear here.",
        "suggestions": [
            "Share a few sentences about your current situation.",
            "The app will calculate output and accuracy rate.",
        ],
        "followUps": [
            "I feel stressed",
            "I feel anxious",
            "I feel depressed",
            "I feel lonely",
            "I cannot sleep",
            "I need coping tips",
        ],
        "issueCounts": {
            "Stress": 0,
            "Anxiety": 0,
            "Depression": 0,
            "Sleep": 0,
            "Loneliness": 0,
            "Academic": 0,
        },
    }


def init_db() -> None:
    conn = get_db()
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT,
            username_key TEXT,
            email TEXT NOT NULL UNIQUE,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            institution TEXT NOT NULL,
            course TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            anonymous_mode INTEGER NOT NULL DEFAULT 0,
            chat_state TEXT NOT NULL,
            analysis_state TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS knowledge_base (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        """
    )
    count = conn.execute("SELECT COUNT(*) FROM knowledge_base").fetchone()[0]
    if count == 0:
        conn.executemany(
            "INSERT INTO knowledge_base (category, question, answer, created_at) VALUES (?, ?, ?, ?)",
            [(item["category"], item["question"], item["answer"], now_iso()) for item in DEFAULT_KNOWLEDGE],
        )
    conn.commit()
    conn.close()


def get_student_by_id(student_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    conn.close()
    return row


def get_student_by_identifier(identifier: str):
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM students WHERE email = ? OR username_key = ?",
        (identifier, identifier),
    ).fetchone()
    conn.close()
    return row


def row_to_student_payload(row: sqlite3.Row) -> dict:
    return {
        "profile": {
            "name": row["name"],
            "username": row["username"] or "",
            "email": row["email"],
            "age": row["age"],
            "gender": row["gender"],
            "institution": row["institution"],
            "course": row["course"],
        },
        "preferences": {
            "anonymousMode": bool(row["anonymous_mode"]),
        },
        "chatMessages": json.loads(row["chat_state"]),
        "analysis": json.loads(row["analysis_state"]),
    }


def save_student_state(student_id: int, chat_messages: list, analysis: dict, anonymous_mode: bool) -> None:
    conn = get_db()
    conn.execute(
        """
        UPDATE students
        SET chat_state = ?, analysis_state = ?, anonymous_mode = ?, updated_at = ?
        WHERE id = ?
        """,
        (
            json.dumps(chat_messages),
            json.dumps(analysis),
            int(anonymous_mode),
            now_iso(),
            student_id,
        ),
    )
    conn.commit()
    conn.close()


def get_knowledge_entries() -> list[dict]:
    conn = get_db()
    rows = conn.execute(
        "SELECT id, category, question, answer, created_at FROM knowledge_base ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


@app.route("/")
def index():
    return render_template("index.html")


@app.get("/api/session")
def api_session():
    role = session.get("role")
    if role == "student" and session.get("student_id"):
        row = get_student_by_id(session["student_id"])
        if row:
            return jsonify({"authenticated": True, "role": "student", "student": row_to_student_payload(row)})
    if role == "therapist":
        return jsonify({"authenticated": True, "role": "therapist"})
    session.clear()
    return jsonify({"authenticated": False})


def count_matches(text: str, words_regex: str) -> int:
    import re

    matches = re.findall(words_regex, text)
    return len(matches)


def clamp(value: int, minimum: int, maximum: int) -> int:
    return max(minimum, min(maximum, value))


def get_dominant_indicator(scores: dict[str, int]) -> str:
    return max(scores, key=scores.get)


def build_summary(status: str, dominant: str, wellness: int, accuracy: int, risk_level: str) -> str:
    if status == "High Risk":
        return "Urgent support is recommended. The chatbot detected high-risk language and the safest next step is immediate human help."
    if dominant == "stress":
        return f"Stress is present. Wellness score is {wellness}, risk level is {risk_level}, and the current accuracy rate is {accuracy}%. Small structured actions can help you feel more in control."
    if dominant == "anxiety":
        return f"Anxiety signals are present. Your output suggests mental overload, but the situation can improve with calming routines and supportive check-ins. Accuracy is {accuracy}%."
    if dominant == "depression":
        return f"Low mood indicators were detected. Gentle support, rest, connection, and one manageable task can help you move toward a more positive state. Accuracy is {accuracy}%."
    if dominant == "loneliness":
        return f"Loneliness indicators are showing up. Reaching out is a strong first step, and building one small social connection can help reduce this feeling. Accuracy is {accuracy}%."
    if dominant == "anger":
        return f"Frustration or anger is present. Slowing down before reacting can help you regain emotional balance. Accuracy is {accuracy}%."
    return f"Your overall mood looks relatively stable. Keep sharing details if you want more accurate emotional analysis and tailored suggestions. Current accuracy is {accuracy}%."


def build_suggestions(dominant: str, alert: bool, sleep_matches: int) -> list[str]:
    if alert:
        return [
            "Contact a trusted person, counselor, guardian, or emergency support immediately.",
            "Do not stay alone if you feel unsafe.",
            "Move away from anything that could be used for self-harm.",
        ]

    suggestions: list[str] = []
    if dominant == "stress":
        suggestions.extend(
            [
                "Take 5 deep slow breaths right now.",
                "Write down your top 3 worries and circle only 1 task to start.",
                "Work for 20 minutes, then take a 5-minute break.",
            ]
        )
    elif dominant == "anxiety":
        suggestions.extend(
            [
                "Name 5 things you can see, 4 you can feel, and 3 you can hear.",
                "Slow your breathing by making the exhale longer than the inhale.",
                "Remind yourself that you can take one small step, not solve everything at once.",
            ]
        )
    elif dominant == "depression":
        suggestions.extend(
            [
                "Start with one tiny positive action like washing your face or drinking water.",
                "Message one trusted friend or family member today.",
                "Choose one manageable task so the day feels less heavy.",
            ]
        )
    elif dominant == "loneliness":
        suggestions.extend(
            [
                "Talk to one classmate, friend, or family member today, even briefly.",
                "Join one study group or campus activity when possible.",
                "Remind yourself that feeling lonely does not mean you are unwanted.",
            ]
        )
    elif dominant == "anger":
        suggestions.extend(
            [
                "Pause before responding and take 10 slow breaths.",
                "Step away from the trigger for a few minutes if you can.",
                "Write your feelings first, then decide how to respond calmly.",
            ]
        )
    else:
        suggestions.extend(
            [
                "Keep noticing what is helping you stay stable.",
                "Maintain sleep, hydration, and small daily routines.",
                "Reach out early if stress starts building up.",
            ]
        )

    if sleep_matches > 0:
        suggestions.append("Keep your phone away 1 hour before sleep and wake up at the same time each day.")
    return suggestions[:4]


def build_followups(dominant: str, alert: bool) -> list[str]:
    if alert:
        return ["Call for help now", "I need emergency support", "Please guide me to a trusted adult"]
    if dominant == "stress":
        return ["What causes your stress?", "My studies are overwhelming", "How to manage stress?", "I also feel anxious"]
    if dominant == "anxiety":
        return ["How do I calm down?", "I panic before exams", "I feel nervous in class", "Help me breathe slowly"]
    if dominant == "depression":
        return ["I have no motivation", "I feel empty", "How can I feel better?", "I cannot focus anymore"]
    if dominant == "loneliness":
        return ["I have no friends", "How to make friends?", "I feel rejected", "I feel lonely in college"]
    return ["I feel stressed", "I feel anxious", "I feel lonely", "I cannot sleep"]


def analyze_conversation(messages: list[dict]) -> dict:
    user_messages = [message for message in messages if message["role"] == "user"]
    if not user_messages:
        return create_base_analysis()

    text = " ".join(message["text"].lower() for message in user_messages)
    stress_matches = count_matches(text, r"\bstress|stressed|pressure|exam|deadline|study|studies|assignment|workload|focus|overwhelmed\b")
    anxiety_matches = count_matches(text, r"\banxious|anxiety|panic|nervous|worried|fear|restless\b")
    depression_matches = count_matches(text, r"\bdepressed|depression|sad|low|hopeless|empty|worthless|crying\b")
    loneliness_matches = count_matches(text, r"\blonely|alone|isolated|rejected|no friends|homesick\b")
    anger_matches = count_matches(text, r"\bangry|anger|frustrated|irritated|furious\b")
    sleep_matches = count_matches(text, r"\bsleep|insomnia|awake|nightmares|tired|fatigue\b")
    academic_matches = count_matches(text, r"\bexam|study|studies|assignment|marks|grade|semester|class\b")
    risk_matches = count_matches(text, r"\bsuicide|kill myself|hurt myself|self harm|end my life|harm someone\b")
    detail_matches = count_matches(text, r"\b\d+\s*(hours|hour|days|day|weeks|week)|because|since|after|before|cannot|can't\b")

    stress = clamp(stress_matches * 18 + sleep_matches * 6 + academic_matches * 4, 0, 100)
    anxiety = clamp(anxiety_matches * 20 + stress_matches * 6, 0, 100)
    depression = clamp(depression_matches * 22 + loneliness_matches * 8, 0, 100)
    loneliness = clamp(loneliness_matches * 22, 0, 100)
    anger = clamp(anger_matches * 22, 0, 100)
    accuracy = clamp(40 + min(len(user_messages) * 9, 24) + min(detail_matches * 7, 30), 20, 96)
    total_load = round((stress + anxiety + depression + loneliness + anger) / 5)
    wellness = clamp(100 - total_load - min(sleep_matches * 5, 14) - (24 if risk_matches else 0), 5, 98)
    alert = risk_matches > 0

    risk_level = "Low"
    if alert:
        risk_level = "Critical"
    elif accuracy < 45 or total_load >= 65:
        risk_level = "High"
    elif accuracy < 70 or total_load >= 35:
        risk_level = "Medium"

    dominant = get_dominant_indicator(
        {
            "stress": stress,
            "anxiety": anxiety,
            "depression": depression,
            "loneliness": loneliness,
            "anger": anger,
            "sleep": sleep_matches * 16,
        }
    )

    status = "Mood Stable"
    emoji = "🙂"
    plan_title = "Positive Support Plan"
    if alert:
        status, emoji, plan_title = "High Risk", "🚨", "Immediate Safety Plan"
    elif dominant == "stress":
        status, emoji, plan_title = "Stress Present", "😟", "Stress Relief Plan"
    elif dominant == "anxiety":
        status, emoji, plan_title = "Anxiety Present", "😰", "Anxiety Support Plan"
    elif dominant == "depression":
        status, emoji, plan_title = "Low Mood Present", "😔", "Mood Recovery Plan"
    elif dominant == "loneliness":
        status, emoji, plan_title = "Loneliness Present", "😶", "Connection Plan"
    elif dominant == "anger":
        status, emoji, plan_title = "Anger Present", "😠", "Calm Response Plan"

    return {
        "emoji": emoji,
        "status": status,
        "wellness": wellness,
        "wellnessLabel": "Mood Stable" if wellness >= 85 else "Needs Support" if wellness >= 60 else "Support Needed",
        "accuracy": accuracy,
        "stress": stress,
        "anxiety": anxiety,
        "depression": depression,
        "loneliness": loneliness,
        "anger": anger,
        "alert": alert,
        "riskLevel": risk_level,
        "planTitle": plan_title,
        "summary": build_summary(status, dominant, wellness, accuracy, risk_level),
        "suggestions": build_suggestions(dominant, alert, sleep_matches),
        "followUps": build_followups(dominant, alert),
        "issueCounts": {
            "Stress": stress_matches,
            "Anxiety": anxiety_matches,
            "Depression": depression_matches,
            "Sleep": sleep_matches,
            "Loneliness": loneliness_matches,
            "Academic": academic_matches,
        },
    }


def find_knowledge_reply(text: str) -> str | None:
    normalized_text = text.lower()
    for entry in get_knowledge_entries():
        question = entry["question"].lower()
        words = [word for word in question.split() if len(word) > 4]
        if question in normalized_text or any(word in normalized_text for word in words):
            return entry["answer"]
    return None


def build_assistant_reply(analysis: dict, latest_text: str) -> str:
    knowledge_reply = find_knowledge_reply(latest_text)
    if knowledge_reply:
        return knowledge_reply
    if analysis["alert"]:
        return "I am really concerned about your safety. Please contact a trusted person, counselor, guardian, or emergency support right now. You do not have to handle this alone."
    if analysis["status"] == "Stress Present":
        return "I understand you are feeling stressed. That is very common for students. You can overcome this step by step. Let us reduce the pressure by focusing on one small task, one calming breath cycle, and one positive thought: you do not have to do everything at once."
    if analysis["status"] == "Anxiety Present":
        return "It sounds like anxiety is showing up strongly right now. That does not mean you are weak. Your body may be on high alert, but it can settle. Let us slow things down, breathe gently, and take one manageable next step together."
    if analysis["status"] == "Low Mood Present":
        return "I am sorry this feels heavy. Even when your mood is low, small positive actions can still help. Be gentle with yourself, choose one tiny task, and remember that difficult feelings can change with support and time."
    if analysis["status"] == "Loneliness Present":
        return "Loneliness can feel very painful, especially as a student. Reaching out here already shows courage. You deserve connection, and one small conversation with a classmate, friend, or family member can be a good positive first step."
    if analysis["status"] == "Anger Present":
        return "It sounds like frustration is building up. That happens sometimes when stress piles up. Let us pause, breathe, and respond with care so this feeling does not control the next moment."
    return "Thank you for sharing. You are doing something positive by talking about your feelings. Keep going, and I will continue to support you with suggestions and live analysis."


def analytics_preview_from_student(row: sqlite3.Row) -> dict:
    analysis = json.loads(row["analysis_state"])
    messages = json.loads(row["chat_state"])
    user_messages = [message for message in messages if message["role"] == "user"]
    return {
        "id": row["id"],
        "name": "Anonymous" if row["anonymous_mode"] else (row["username"] or row["name"]),
        "messages": len(user_messages),
        "riskLevel": analysis["riskLevel"],
        "wellness": analysis["wellness"],
        "accuracy": analysis["accuracy"],
        "alert": analysis["alert"],
        "anonymous": bool(row["anonymous_mode"]),
        "updatedAt": row["updated_at"],
        "issues": analysis.get("issueCounts", {}),
    }


def therapist_dashboard_payload() -> dict:
    conn = get_db()
    rows = conn.execute("SELECT * FROM students ORDER BY updated_at DESC").fetchall()
    conn.close()
    previews = [analytics_preview_from_student(row) for row in rows]
    active_alerts = [item for item in previews if item["alert"]]
    total_messages = sum(item["messages"] for item in previews)
    avg_mood = round(sum(item["wellness"] for item in previews) / len(previews)) if previews else 0
    issues = {"Stress": 0, "Anxiety": 0, "Depression": 0, "Sleep": 0, "Loneliness": 0, "Academic": 0}
    for preview in previews:
        for key, value in preview["issues"].items():
            if key in issues:
                issues[key] += value

    return {
        "metrics": {
            "registeredStudents": len(previews),
            "chatSessions": len([item for item in previews if item["messages"] > 0]),
            "crisisAlerts": len(active_alerts),
            "trainedQa": len(get_knowledge_entries()),
            "reportSessions": len([item for item in previews if item["messages"] > 0]),
            "reportUsers": len(previews),
            "reportMessages": total_messages,
            "reportMood": avg_mood,
            "reportCritical": len([item for item in previews if item["riskLevel"] == "Critical"]),
            "reportAnonymous": len([item for item in previews if item["anonymous"]]),
        },
        "alerts": active_alerts,
        "sessions": previews,
        "issues": issues,
    }


def require_student():
    if session.get("role") != "student" or not session.get("student_id"):
        return jsonify({"error": "Student authentication required."}), 401
    return None


def require_therapist():
    if session.get("role") != "therapist":
        return jsonify({"error": "Therapist authentication required."}), 401
    return None


@app.post("/api/register")
def api_register():
    data = request.get_json(force=True)
    name = data.get("name", "").strip()
    username = data.get("username", "").strip()
    email = normalize(data.get("email", ""))
    raw_age = str(data.get("age", "")).strip()
    gender = data.get("gender", "Prefer not to say")
    institution = data.get("institution", "").strip()
    course = data.get("course", "").strip()
    password = data.get("password", "")
    confirm = data.get("confirmPassword", "")
    anonymous_mode = bool(data.get("anonymousMode"))

    try:
        age = int(raw_age or 0)
    except ValueError:
        return jsonify({"error": "Enter a valid age to continue registration."}), 400

    if not all([name, email, age, institution, course, password, confirm]):
        return jsonify({"error": "Please complete all required registration fields."}), 400
    if age < MIN_AGE or age > MAX_AGE:
        return jsonify({"error": f"Only students aged {MIN_AGE} to {MAX_AGE} can use this app."}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must contain at least 8 characters."}), 400
    if password != confirm:
        return jsonify({"error": "Password and confirm password do not match."}), 400

    username_key = normalize(username) if username else ""
    conn = get_db()
    exists = conn.execute(
        "SELECT 1 FROM students WHERE email = ? OR (username_key != '' AND username_key = ?)",
        (email, username_key),
    ).fetchone()
    if exists:
        conn.close()
        return jsonify({"error": "This username or email is already registered."}), 400

    messages = [create_welcome_message()]
    analysis = create_base_analysis()
    cursor = conn.execute(
        """
        INSERT INTO students (
            name, username, username_key, email, age, gender, institution, course,
            password_hash, anonymous_mode, chat_state, analysis_state, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            name,
            username,
            username_key,
            email,
            age,
            gender,
            institution,
            course,
            generate_password_hash(password),
            int(anonymous_mode),
            json.dumps(messages),
            json.dumps(analysis),
            now_iso(),
            now_iso(),
        ),
    )
    student_id = cursor.lastrowid
    conn.commit()
    row = conn.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    conn.close()

    session.clear()
    session["role"] = "student"
    session["student_id"] = student_id
    return jsonify({"student": row_to_student_payload(row)})


@app.post("/api/student/login")
def api_student_login():
    data = request.get_json(force=True)
    identifier = normalize(data.get("identifier", ""))
    password = data.get("password", "")
    if not identifier or not password:
        return jsonify({"error": "Enter your username or email and password."}), 400

    row = get_student_by_identifier(identifier)
    if not row or not check_password_hash(row["password_hash"], password):
        return jsonify({"error": "Connection failed. Username or password does not match registration details."}), 401

    session.clear()
    session["role"] = "student"
    session["student_id"] = row["id"]
    return jsonify({"student": row_to_student_payload(row)})


@app.post("/api/therapist/login")
def api_therapist_login():
    data = request.get_json(force=True)
    email = normalize(data.get("email", ""))
    password = data.get("password", "")
    if email != THERAPIST_ACCOUNT["email"] or password != THERAPIST_ACCOUNT["password"]:
        return jsonify({"error": "Therapist connection failed. Invalid therapist credentials."}), 401
    session.clear()
    session["role"] = "therapist"
    return jsonify({"therapist": {"name": THERAPIST_ACCOUNT["name"]}})


@app.post("/api/logout")
def api_logout():
    session.clear()
    return jsonify({"ok": True})


@app.post("/api/student/new-chat")
def api_student_new_chat():
    auth_error = require_student()
    if auth_error:
        return auth_error

    row = get_student_by_id(session["student_id"])
    payload = row_to_student_payload(row)
    payload["chatMessages"] = [create_welcome_message()]
    payload["analysis"] = create_base_analysis()
    save_student_state(row["id"], payload["chatMessages"], payload["analysis"], payload["preferences"]["anonymousMode"])
    return jsonify({"student": payload})


@app.post("/api/chat")
def api_chat():
    auth_error = require_student()
    if auth_error:
        return auth_error

    data = request.get_json(force=True)
    message_text = data.get("message", "").strip()
    if not message_text:
        return jsonify({"error": "Message is required."}), 400

    row = get_student_by_id(session["student_id"])
    payload = row_to_student_payload(row)
    payload["chatMessages"].append(
        {
            "id": now_iso(),
            "role": "user",
            "createdAt": now_iso(),
            "text": message_text,
        }
    )
    analysis = analyze_conversation(payload["chatMessages"])
    payload["chatMessages"].append(
        {
            "id": now_iso(),
            "role": "assistant",
            "createdAt": now_iso(),
            "text": build_assistant_reply(analysis, message_text),
        }
    )
    payload["analysis"] = analysis
    save_student_state(row["id"], payload["chatMessages"], payload["analysis"], payload["preferences"]["anonymousMode"])
    return jsonify({"student": payload})


@app.get("/api/therapist/dashboard")
def api_therapist_dashboard():
    auth_error = require_therapist()
    if auth_error:
        return auth_error
    return jsonify(therapist_dashboard_payload())


@app.get("/api/therapist/knowledge")
def api_therapist_knowledge():
    auth_error = require_therapist()
    if auth_error:
        return auth_error
    return jsonify({"entries": get_knowledge_entries()})


@app.post("/api/therapist/knowledge")
def api_therapist_knowledge_create():
    auth_error = require_therapist()
    if auth_error:
        return auth_error

    data = request.get_json(force=True)
    category = data.get("category", "").strip() or "General"
    question = data.get("question", "").strip()
    answer = data.get("answer", "").strip()
    if not question or not answer:
        return jsonify({"error": "Enter both a user phrase and a bot response."}), 400

    conn = get_db()
    conn.execute(
        "INSERT INTO knowledge_base (category, question, answer, created_at) VALUES (?, ?, ?, ?)",
        (category, question, answer, now_iso()),
    )
    conn.commit()
    conn.close()
    return jsonify({"entries": get_knowledge_entries()})


init_db()


if __name__ == "__main__":
    app.run(debug=True)
