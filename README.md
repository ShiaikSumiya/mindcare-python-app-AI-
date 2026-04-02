# MindCare Python App

This project is a Python + Flask student mental wellness app inspired by your screenshot references. It includes student registration, student login, therapist login, AI-style chat analysis, accuracy scoring, suggestions, crisis detection, reports, and a therapist knowledge base.

## Main flow

1. A student registers first.
2. After successful registration, the chatbot opens immediately.
3. If the same student comes back later, they use the student login form.
4. Login works only when the username or email and password match the stored registration details.
5. The chatbot analyzes the student's message and shows:
   - mental health status
   - wellness score
   - accuracy rate
   - positive suggestions
   - risk alert if harmful language is detected
6. A therapist can log in separately to view dashboard analytics and train the chatbot with new Q&A responses.

## Python stack

- `Flask` for routes and page serving
- `SQLite` for student accounts, chat state, and therapist knowledge
- Python-based text analysis for stress, anxiety, depression, sleep, loneliness, anger, and risk signals

## Run the app

### Option 1: PowerShell

Open PowerShell in:

`C:\Users\shaik\OneDrive\Desktop\ai assistent`

Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

Start the app:

```powershell
python app.py
```

Then open:

`http://127.0.0.1:5000`

### Option 2: Double-click launcher

Double-click:

`run_mindcare.bat`

That starts the Python app from the correct folder.

## Demo therapist login

- Email: `therapist@mindcare.com`
- Password: `Therapist@123`

## Main files

- `app.py` - Flask backend, auth, NLP-style analysis, therapist APIs, SQLite setup
- `templates/index.html` - main UI template
- `static/styles.css` - screenshot-inspired styling
- `static/app.js` - frontend logic connected to Flask APIs
- `mindcare.db` - SQLite database
- `requirements.txt` - Python dependency list
- `run_mindcare.bat` - quick launcher for Windows

## Notes

- Student access is limited to ages `13` to `25`.
- Student login fails if the registration username/email and password do not match.
- Accuracy colors are:
  - green for high
  - orange for medium
  - red for low
- Therapist dashboard includes crisis alerts, recent sessions, reports, and chatbot training entries.
