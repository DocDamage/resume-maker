# Resume Maker

A modern, AI-powered resume builder that runs entirely in your browser. Build, edit, and export professional resumes with real-time preview. Features embedded AI for resume parsing and improvement — no backend required.

## Features

- **Live Preview**: Side-by-side editor with instant A4 preview
- **3 Templates**: Modern, Classic, Minimal
- **PDF Export**: One-click download
- **Drag & Drop**: Reorder experience, education, and projects
- **Upload Existing Resumes**: Import PDF/DOCX files
- **AI-Powered Parsing**: Automatically structure uploaded resumes
- **AI Improvements**: Enhance summaries, bullet points, and skills
- **Fully Private**: Local AI mode runs in your browser with no data sent to servers

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Zustand
- @mlc-ai/web-llm (embedded AI)
- html2canvas + jsPDF (PDF export)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## AI Modes

| Mode | Description |
|------|-------------|
| **Local (Embedded)** | Downloads a small LLM (350MB–1.9GB) directly into your browser. Fully private, no API key. |
| **OpenAI API** | Uses OpenAI cloud models. Requires an API key. |

## Building

```bash
npm run build
```

The static site will be output to the `dist/` folder.
