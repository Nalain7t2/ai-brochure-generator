# AI Brochure Generator

> Full-stack AI product that scrapes any company website, summarizes it with an LLM, and generates a professional HTML brochure — end to end.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![Django](https://img.shields.io/badge/Django_REST-Framework-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI-orange)

---

## Demo

<!-- Add screenshots here after taking them -->
<!-- ![Home](docs/home.png) -->
<!-- ![Result](docs/result.png) -->

**Live flow:**
1. User enters company name + website URL  
2. Backend scrapes and cleans website content  
3. **LLM Call #1** → 5-bullet business summary  
4. **LLM Call #2** → Production-ready HTML brochure  
5. Frontend shows live preview + download  

---

## Architecture
┌─────────────────┐ POST /api/generate-brochure/ ┌──────────────────┐
│ Next.js │ ─────────────────────────────────► │ Django REST API │
│ Frontend │ ◄───────────────────────────────── │ + Gemini LLM │
│ (React + TW) │ JSON Response │ + BeautifulSoup │
└─────────────────┘ └──────────────────┘

text


### LLM Chaining Pipeline
Website HTML
→ BeautifulSoup (clean text)
→ Gemini Call #1 (summarize, temp=0.3)
→ Gemini Call #2 (HTML brochure, temp=0.5)
→ Validated HTML output

text


---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Django, Django REST Framework |
| AI | Google Gemini (OpenAI-compatible API) |
| Scraping | Requests + BeautifulSoup |
| Validation | DRF Serializers |
| Auth/Secrets | python-dotenv, CORS |

---

## Features

- Dual-step **LLM call chaining** (summarize → design)
- DRF serializers with proper input validation
- Prompt-injection resistant system prompts
- Token-aware content truncation (5000 chars)
- Live HTML preview (sandboxed iframe)
- One-click brochure download
- Error handling for blocked sites, empty content, API failures
- Production-aware CORS + separation of services/views

---

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

python manage.py migrate
python manage.py runserver 8080
Frontend
Bash

cd frontend
npm install
npm run dev
Open http://localhost:3000

API
text

POST /api/generate-brochure/
Content-Type: application/json

{
  "company_name": "Tesla",
  "website_url": "https://en.wikipedia.org/wiki/Tesla,_Inc."
}
Success (200):

JSON

{
  "success": true,
  "company_name": "Tesla",
  "summary": "• ...",
  "html_brochure": "<!DOCTYPE html>..."
}
Project Structure
text

backend/
  generator/
    services.py      # AI logic (scrape + LLM chain)
    serializers.py   # Input validation
    views.py         # DRF APIView
  brochure_project/  # Django settings

frontend/
  app/
    page.js          # Main UI
    globals.css
Engineering Notes
Business logic lives in services.py (framework-agnostic)
Views only handle HTTP; serializers handle validation
Website content is treated as untrusted data in prompts
Model name is configurable via env (GEMINI_MODEL)
Some large sites (Tesla, Amazon) block scrapers — use open pages for demos
Author
Nalain Abbas
Full-Stack Developer → Applied AI Engineer

