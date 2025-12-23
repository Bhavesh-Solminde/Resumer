# Resumer — AI-Powered Resume Optimizer

Resumer is a full-stack application that helps candidates analyze and optimize resumes with Gemini-powered insights. It offers ATS scoring, tailored rewrite suggestions, JD matching, and a polished UI that supports both light and dark themes.

## Table of Contents

- Overview
- Architecture & Tech Stack
- Features
- Frontend (Vite + React)
- Backend (Express + Gemini)
- API Surface
- Environment Variables
- Local Development
- Design System
- Project Structure
- Testing & Quality
- Roadmap

## Overview

The app guides users through uploading a resume, receiving AI-generated analysis, optimizing content for general improvements or specific job descriptions, and saving versions to history. The UI uses Tailwind v4 with Shadcn and Aceternity components, and the backend uses Express with Gemini for content generation and Cloudinary for asset storage.

## Architecture & Tech Stack

- Monorepo: `frontend/` (Vite + React Router) and `backend/` (Express, ES Modules).
- Language: JavaScript (ESM everywhere; no CommonJS).
- AI: Google Gemini (`gemini-2.0-flash`).
- Storage: MongoDB (resume scans and user profiles).
- Assets: Cloudinary for resume PDFs and thumbnails.
- Auth: JWT middleware; OAuth strategies (GitHub/Google) are scaffolded.
- Styling: Tailwind v4 utilities + Shadcn UI primitives + Aceternity animations.

## Features

- Resume analysis: Upload PDF, extract text, score, and get structured feedback (summary, skills, missing keywords, formatting issues, actionable tips).
- Optimization flows:
  - General optimization (`/optimize/general`): Before/After comparison with ATS score delta.
  - JD match (`/optimize/jd`): Tailors resume to a provided job description, adds missing keywords.
- History: Persisted resume scans with URLs and AI results; copy-to-clipboard helpers in UI.
- Theming: Light/dark via CSS variables; semantic tokens (`bg-background`, `text-foreground`, `border-border`).
- UI polish: Animated hero/sections (Aceternity), reusable Shadcn components (button, card, dialog, textarea, progress, switch), responsive layouts.

## Frontend (Vite + React)

- Routing: `react-router-dom` v7; pages live in `src/pages` (Landing, Analyze, Optimize, Profile, etc.).
- State: Lightweight stores in `src/store` (e.g., `Resume.store.js`, `History.store.js`, `Auth.store.js`).
- Key components:
  - Analyze flow: Upload card, previous scans, results display.
  - Optimize flow: Tabs for General vs JD, textarea for JD input, score cards, comparison grid with copy actions.
  - Profile: History grid, analysis dialog, security and profile cards.
  - UI kit: Buttons, cards, dialogs, inputs, textarea, switch, progress, loaders, animated backgrounds.
- Styling: Tailwind v4 utility classes with `cn()` helper; semantic colors ensure theming works (we removed hardcoded dark-mode colors in Optimize).

## Backend (Express + Gemini)

- Controllers:
  - `handleAnalyzeResume`: PDF parse → Gemini analysis → save to `ResumeScan` with ATS score and analysis JSON.
  - `optimizeResume` (general) and `optimizeJd`: PDF parse or last-scan fallback → Gemini optimization → saved snapshot.
  - `saveResumeScan`: Persists AI result, Cloudinary URL, thumbnail fallback, and resume text.
- Middlewares: `verifyJWT`, `memory.middleware` (multer memory storage), `uploadToCloudinaryMiddleware`.
- Models: `user.model.js`, `resumeScan.model.js` (history of analyses/optimizations).
- Cloudinary: `cloudinaryUpload` returns the full upload result (not just the URL) so controllers can access `secure_url` and derived thumbnails.

## API Surface (prefix: `/api/v1/resume`)

- POST `/analyze` — Upload `resume` (PDF). Auth required. Returns ATS score + structured analysis.
- POST `/optimize/general` — Upload `resume` or reuse latest. Auth required. Returns before/after scores and comparison grid; saves scan.
- POST `/optimize/jd` — Same as above, with `jobDescription` in body; tailors resume to JD and saves scan.

## Environment Variables

Create `backend/.env` with:

- `PORT` — API port (e.g., 4000)
- `MONGODB_URI` — Mongo connection string
- `GEMINI_API_KEY` — Google Generative AI key
- `JWT_SECRET` — Auth signing key
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Asset uploads

Create `frontend/.env` with:

- `VITE_API_BASE_URL` — Points to backend (e.g., `http://localhost:4000/api/v1`)

## Local Development

1. Install deps

- `npm install` (root, then `backend/`, `frontend/` if needed)

2. Backend

- `cd backend`
- `npm run dev` (nodemon)

3. Frontend

- `cd frontend`
- `npm run dev` (Vite)

4. Open app

- Frontend on Vite port (default 5173); backend on `PORT`.

## Design System

- Color tokens: `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`, etc., mapped to CSS variables for theme switching.
- Components: Shadcn primitives (button, card, dialog, textarea, input, switch, progress) plus Aceternity motion components (hero highlight, floating dock, bento grid, moving cards, background beams/stars).
- Motion: `motion/react` for fades/staggers in result sections; loaders for async states.
- Layout: Responsive grid for score cards and comparison; cards use semantic colors (red/green) with light/dark variants.

## Project Structure (high level)

- `frontend/src/pages` — Views (Landing, Analyze, Optimize, Profile, etc.)
- `frontend/src/components/ui` — Shadcn/Aceternity primitives
- `frontend/src/components/analyze`, `frontend/src/components/profile` — Feature blocks
- `frontend/src/store` — Auth, history, resume stores
- `backend/src/controllers` — Analyze/optimize/auth/profile controllers
- `backend/src/routes` — Express routers (analyze, optimize, auth, profile)
- `backend/src/middlewares` — Auth, memory upload, etc.
- `backend/src/lib/cloudinary.js` — Upload helper (returns full result object)

## Testing & Quality

- Linting: ESLint configured for both frontend and backend.
- Error handling: All async controllers wrapped with `asyncHandler`; API errors surfaced with `ApiError`/`ApiResponse` helpers.
- Logging: Avoid logging raw resume text; use length-only or hashed indicators for PII safety.

## Roadmap

- Add e2e tests for upload/analysis flows.
- Add rate limiting and better retry for Gemini calls.
- Add richer history UI (filters, pagination) and export options.
- Manage History Properly in UI.
- also use inbuilt cloudinary tumbnail creter to create thumbnail for history
