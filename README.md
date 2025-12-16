\# SmartSimplify

\### An Accessible AI Text and Voice-Based Simplification System



\*\*Course:\*\* CSE 518 – Human-Computer Interaction  

\*\*Author:\*\* Dharma Bagadia  

\*\*Institution:\*\* Stony Brook University  



---



\## 🧠 Project Overview



SmartSimplify is an AI-powered accessibility tool designed to simplify complex

text for improved reading comprehension. The system is built around

\*\*Human-Computer Interaction (HCI) principles\*\*, emphasizing accessibility,

transparency, and user control.



Unlike traditional text simplification tools that rely on copy–paste workflows,

SmartSimplify treats simplification as an \*\*interactive process\*\*, supporting

paragraph-level control, multi-modal input, and transparent output visualization.



The project’s core innovation is \*\*Voice-Based Paragraph Selection\*\*, which

allows users to simplify specific parts of a document using natural speech.



---



\## ✨ Key Features



\- \*\*Multi-Level Text Simplification\*\*

&nbsp; - Basic, Intermediate, and Advanced levels

&nbsp; - User-controlled simplification intensity



\- \*\*Voice-Based Paragraph Selection (Core Contribution)\*\*

&nbsp; - Speak the first few words of a paragraph

&nbsp; - System automatically identifies and simplifies the correct section

&nbsp; - Designed for accessibility and low-effort interaction



\- \*\*Multi-Modal Input\*\*

&nbsp; - Paste text

&nbsp; - Upload PDF documents

&nbsp; - Mouse-based text selection

&nbsp; - Voice-based selection



\- \*\*Transparent Output\*\*

&nbsp; - Inline Diff view (word-level changes highlighted)

&nbsp; - Side-by-side comparison

&nbsp; - Simplified-only view

&nbsp; - FKGL (Flesch–Kincaid Grade Level) readability scores



\- \*\*Accessibility Enhancements\*\*

&nbsp; - Dyslexia-friendly font

&nbsp; - High-contrast mode

&nbsp; - Text-to-speech (Read Aloud)



---



\## 🖼️ Screenshots



\### Main Interface \& Input Controls

!\[Main UI](screenshots/main\_ui.png)



\### Advanced Options \& Accessibility Toggles

!\[Advanced Options](screenshots/advanced\_options.png)



\### Inline Diff Visualization

!\[Inline Diff](screenshots/image6.png)



\### Readability Improvement (FKGL)

!\[FKGL Reduction](screenshots/image7.png)



> 📌 Screenshots are taken from the working prototype and demonstrate

> paragraph-level simplification, transparency, and accessibility features.



---



\## 🏗️ System Architecture



!\[System Architecture](diagrams/system\_architecture.png)



SmartSimplify follows a modular client–server architecture:



\- \*\*Frontend:\*\* React + TypeScript  

\- \*\*Backend:\*\* FastAPI (Python)  

\- \*\*AI Model:\*\* Google Gemini 2.5 Flash  

\- \*\*Supporting Tools:\*\* PyPDF2, SQLite caching, FKGL calculator, inline diff engine



---



\## 🎙️ Voice-Based Paragraph Selection



!\[Voice Pipeline](diagrams/voice\_pipeline.png)



\### Workflow:

1\. User speaks the first few words of a paragraph

2\. Speech is transcribed using the Web Speech API

3\. Text is tokenized and compared using Jaccard similarity

4\. Best-matching paragraph is selected

5\. Only the matched paragraph is simplified



This design follows the HCI heuristic of \*\*Recognition Rather Than Recall\*\* and

significantly reduces interaction effort for users with motor or visual

impairments.



---



\## 📊 Evaluation Summary



\- \*\*Readability Improvement\*\*

&nbsp; - Up to \*\*7.5 grade-level reduction\*\* using FKGL at the Basic level



\- \*\*Functional Validation\*\*

&nbsp; - Voice-based selection achieved \*\*>90% accuracy\*\*

&nbsp; - Hybrid mouse + voice interaction worked reliably



\- \*\*Heuristic Evaluation\*\*

&nbsp; - Conducted using Nielsen’s usability heuristics

&nbsp; - Strong performance in:

&nbsp;   - Visibility of system status

&nbsp;   - User control and freedom

&nbsp;   - Accessibility and transparency



---



\## 🚀 How to Run the Project



\### Prerequisites

\- Node.js (v18+ recommended)

\- Python 3.10+

\- Google Gemini API key

\- Modern browser (Chrome recommended for voice support)



---



\### 1️⃣ Backend Setup (FastAPI)



```bash

cd backend

python -m venv .venv

.venv\\Scripts\\activate        # Windows

pip install -r requirements.txt



