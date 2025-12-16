# SmartSimplify  
### An Accessible AI Text and Voice-Based Simplification System

**Course:** CSE 518 – Human-Computer Interaction  
**Author:** Dharma Bagadia  
**Institution:** Stony Brook University  

---

## 🧠 Project Overview

**SmartSimplify** is an AI-powered accessibility tool designed to simplify complex text and improve reading comprehension. The system is grounded in **Human-Computer Interaction (HCI) principles**, with a strong emphasis on **accessibility, transparency, and user control**.

Unlike traditional text simplification tools that rely on static copy–paste workflows, SmartSimplify treats simplification as an **interactive, user-driven process**. Users can simplify **specific paragraphs**, control the **degree of simplification**, and clearly understand **how the AI modified the text**.

A key contribution of this project is **Voice-Based Paragraph Selection**, which allows users to select text for simplification using natural speech—significantly reducing interaction effort and improving accessibility.

---

## ✨ Key Features

### 🔤 Multi-Level Text Simplification
- Three user-controlled levels: **Basic, Intermediate, Advanced**
- Adjustable simplification strength based on user needs

### 🎙️ Voice-Based Paragraph Selection *(Core Contribution)*
- Speak the first few words of a paragraph
- Automatic paragraph identification
- Hands-free, low-effort interaction

### 🖱️ Multi-Modal Input
- Paste text directly
- Upload PDF documents
- Mouse-based paragraph selection
- Voice-based paragraph selection

### 🔍 Transparent Output Visualizations
- **Inline Diff View** (word-level changes highlighted)
- **Side-by-Side View** (original vs simplified)
- **Simplified-Only View** (distraction-free reading)
- **FKGL (Flesch–Kincaid Grade Level)** readability scores

### ♿ Accessibility Features
- Dyslexia-friendly font
- High-contrast mode
- Text-to-speech (Read Aloud)

---

## 🖼️ Screenshots

> Place screenshots inside a `screenshots/` directory.

### Main Interface
<img width="1891" height="960" alt="Simple UI" src="https://github.com/user-attachments/assets/2d8f9c33-7703-4b5b-a64e-61f5ef09c467" />


### Advanced Options & Accessibility Controls
<img width="952" height="245" alt="showing adavaced option in this screenshot from which we can change simplification level" src="https://github.com/user-attachments/assets/c7ceb52a-21eb-479e-91a9-a4eaeeb2874d" />


### Inline Diff Visualization
<img width="1336" height="905" alt="showing how speak to simplify works and showing inline view also change the simplification level to basic so the readability score changes a lot which is showin in the  screenshot" src="https://github.com/user-attachments/assets/dbd86bc4-7062-4056-999e-9990c6b32bae" />


### Readability Improvement (FKGL Reduction)
<img width="1336" height="905" alt="showing how speak to simplify works and showing inline view also change the simplification level to basic so the readability score changes a lot which is showin in the  screenshot" src="https://github.com/user-attachments/assets/0d976cff-c1e7-46a1-97f0-2902d41c0264" />


---

## 🏗️ System Architecture

> Place diagrams inside a `diagrams/` directory.

<img width="1536" height="1024" alt="System Architecture" src="https://github.com/user-attachments/assets/81446e0c-3db4-4d85-ac23-99bd98789c3f" />


**Architecture Overview:**
- **Frontend:** React + TypeScript  
- **Backend:** FastAPI (Python)  
- **AI Model:** Google Gemini 2.5 Flash  
- **Supporting Tools:**  
  - PyPDF2 (PDF extraction)  
  - FKGL readability calculator  
  - SQLite caching layer  
  - Inline diff engine  

---

## 🎙️ Voice-Based Paragraph Selection

<img width="102" height="153" alt="voice controlled flowchart" src="https://github.com/user-attachments/assets/a3892188-a5ce-4496-815f-298f9fa94109" />


### Workflow

1. User speaks the first few words of a paragraph  
2. Speech is transcribed using the Web Speech API  
3. Tokens are extracted from both the transcript and document paragraphs  
4. Jaccard similarity is computed for paragraph matching  
5. The best-matching paragraph is selected  
6. Only the selected paragraph is simplified  

This interaction design aligns with the HCI heuristic of **Recognition Rather Than Recall**, reducing cognitive and motor effort—especially for users with visual or motor impairments.

---

## 📊 Evaluation Summary

### 📉 Readability Improvement
- Up to **7+ grade-level reduction** (FKGL) at the **Basic** simplification level

### 🧪 Functional Testing
- Voice-based paragraph selection accuracy: **~90%**
- Seamless switching between mouse and voice input

### 🧠 Heuristic Evaluation (Nielsen)
- Evaluated using established usability heuristics
- Strong performance in:
  - Visibility of system status  
  - User control and freedom  
  - Recognition over recall  
  - Accessibility and transparency  

---

## 🚀 How to Run the Project

### Prerequisites

- Node.js **v18+**
- Python **3.10+**
- Google Gemini API Key
- Chrome browser *(recommended for voice support)*

---

### 1️⃣ Backend Setup (FastAPI)

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate   # Windows
pip install -r requirements.txt
```
Start the backend server:
```
uvicorn main:app --reload
```
### 2️⃣ Frontend Setup (React + TypeScript)
```
cd frontend
npm install
npm run dev
```
