import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, HTTPException
import io
from PyPDF2 import PdfReader


from prompts import LEVELS
from cache import get_cached, set_cached
from readability import fkgl, length_ratio
from diff_utils import diff_html


load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


if not GEMINI_KEY:
    raise RuntimeError("GEMINI_API_KEY not set in environment")


genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel(model_name=MODEL_NAME)


app = FastAPI(title="AI Simplifier API")
app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)


class SimplifyReq(BaseModel):
    text: str
    level: str # "basic" | "intermediate" | "advanced"


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_NAME}

@app.get("/models")
def models():
    out = []
    for m in genai.list_models():
        out.append({
            "name": m.name,  # often looks like "models/gemini-1.5-flash"
            "supports": getattr(m, "supported_generation_methods", []),
        })
    return out



@app.post("/simplify")
async def simplify(req: SimplifyReq):
    level = req.level.lower()
    if level not in LEVELS:
        level = "intermediate"
    prefix = LEVELS[level]["prefix"]


    cached = get_cached(req.text, level, MODEL_NAME)
    if cached:
        simplified = cached
    else:
        # Build prompt. You can add system instructions via safety settings if needed.
        prompt = prefix + req.text
        resp = model.generate_content(prompt)
        simplified = (resp.text or "").strip()
        set_cached(req.text, level, MODEL_NAME, simplified)


    return {
        "simplified": simplified,
        "fkgl_before": fkgl(req.text),
        "fkgl_after": fkgl(simplified),
        "length_ratio": length_ratio(req.text, simplified),
        "inline_diff_html": diff_html(req.text, simplified),
    }

@app.post("/extract_pdf")
async def extract_pdf(file: UploadFile = File(...)):
    # Basic type check
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    data = await file.read()
    try:
        reader = PdfReader(io.BytesIO(data))
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read PDF file.")

    pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text)

    if not pages:
        raise HTTPException(status_code=400, detail="No extractable text found in PDF.")

    full_text = "\n\n".join(pages)
    return {"text": full_text}
