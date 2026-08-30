# Resume Builder

A privacy-first, ATS-friendly resume builder. Fill in your info, watch a live
preview update, and export a real, text-searchable PDF — no account, no
backend, no data leaving your browser.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Build for production / deploy

```bash
npm run build
```

This outputs a static `dist/` folder — deploy it as-is to Vercel, Netlify, or
any static host. No server or environment variables required.

## Tech stack

- **React + Vite + TypeScript** — client-only app, fast dev/build
- **Tailwind CSS v4** — design system via `@theme` tokens in `src/index.css`
- **React Context + useReducer** — single `ResumeData` object drives forms,
  live preview, and PDF export (see `src/store/`)
- **localStorage** — auto-saves your draft on this device only
- **@react-pdf/renderer** — generates a real PDF document (not a screenshot),
  so exported text is selectable and ATS-parseable; lazily loaded only when
  you click "Download PDF" to keep the initial page fast

## Project structure

```
src/
  types/resume.ts          Core data model
  store/                   Reducer, Context provider, defaults
  components/
    landing/                Marketing/landing page
    editor/
      forms/                 One form component per resume section
      FormsPanel.tsx         Accordion wiring forms + reorder/visibility
      EditorLayout.tsx        Two-panel (desktop) / tabbed (mobile) layout
      DownloadPdfButton.tsx
    preview/ResumePreview.tsx  Live HTML preview (mirrors PDF layout)
    pdf/ResumePdfDocument.tsx  @react-pdf/renderer document definition
    ui/                      Shared small controls (inputs, toggle, etc.)
```

## What's implemented (v2 — polished, multi-template)

- [x] Intro badge (2–3s, once per session, non-blocking)
- [x] Landing page: tightened hero, features, templates showcase, ATS explainer, footer
- [x] Full resume data model: contact, summary, education, experience,
      internships, projects, technical/soft skills, certifications,
      achievements, languages, awards, unlimited custom sections
- [x] 4 distinct ATS-safe templates (Classic, Modern, Minimal, Professional) —
      switching preserves all data
- [x] Customization: font, font/heading size, line/section spacing, margins,
      Compact/Balanced/Spacious presets, all clamped to safe ranges
- [x] Photo editor: drag-to-reposition, zoom, circle/square shape — optional,
      never forced, adjustments preserved in both preview and PDF
- [x] Two-panel editor (desktop) / tabbed (mobile) with live preview,
      autosave indicator, email validation, confirm-before-delete on
      destructive actions
- [x] Add / remove / reorder / rename / show-hide any section
- [x] Rule-based resume quality checklist (not an ATS guarantee)
- [x] Sample resume shown in the preview before the user starts typing
- [x] PDF export with real selectable text, correct A4 size, consistent
      margins, page breaks that never split an entry mid-way, matching the
      selected template and customization settings
- [x] No accounts, no server storage, nothing sent to a third-party AI

## Deliberately not implemented yet (per project scope)

AI resume suggestions, ATS scoring beyond the rule-based checklist,
job-description matching, cloud saving, authentication, resume history,
cover letter generation.
