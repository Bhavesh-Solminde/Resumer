# Resumer - AI Powered Resume Optimizer

Resumer is a modern web application designed to help job seekers optimize their resumes using advanced AI analysis. It provides instant feedback, ATS scoring, and tailored suggestions to improve resume quality and relevance.

## 🛠 Code Style & Architecture

This project follows a modern, modular, and scalable architecture. Below are the specific coding standards and conventions used throughout the codebase.

### 1. Project Structure

The project is organized as a monorepo with distinct separation of concerns:

- **`/frontend`**: React-based Single Page Application (SPA).
- **`/backend`**: Node.js/Express API server.

### 2. Frontend Architecture

- **Framework**: React 19 + Vite.
- **Language**: JavaScript (ES6+).
- **Styling**:
  - **Tailwind CSS v4**: Used for utility-first styling.
  - **Shadcn UI**: Used for accessible, reusable base components (Buttons, Cards, Dialogs).
  - **Aceternity UI**: Used for high-fidelity animations and hero sections (Floating Dock, Bento Grid, Hero Highlight).
  - **Theme**: Dark/Light mode support via `next-themes` (or custom Context) with CSS variables for colors (e.g., `oklch` color space).
- **Routing**: `react-router-dom` v7.
- **File Naming Conventions**:
  - **Components**: PascalCase (e.g., `LandingPage.jsx`, `ResumeAnalysisDisplay.jsx`).
  - **Hooks/Utils**: camelCase (e.g., `useTheme.js`, `cn.js`).
  - **Directories**: lowercase/kebab-case (e.g., `components/ui`, `pages`).
- **Component Structure**:
  - Components are functional and use Hooks (`useState`, `useEffect`, custom hooks).
  - UI components are kept in `src/components/ui`.
  - Page views are kept in `src/pages`.
  - Layout wrappers are in `src/layouts`.

### 3. Backend Architecture

- **Runtime**: Node.js.
- **Module System**: **ES Modules** (`import`/`export`) are used exclusively.
- **Framework**: Express.js.
- **Pattern**: MVC (Model-View-Controller) - specifically Controllers and Routes.
- **Error Handling**: Async functions are wrapped in an `asyncHandler` utility to manage exceptions cleanly.
- **File Naming Conventions**:
  - **Controllers**: `*.controllers.js` (e.g., `analyze.controllers.js`).
  - **Routes**: `*.routes.js` (e.g., `resume.routes.js`).
  - **Utilities**: `*.js` (e.g., `asyncHandler.js`).
- **Key Libraries**:
  - `@google/generative-ai`: For Gemini AI integration.
  - `pdf-parse`: For extracting text from uploaded resumes.

### 4. General Conventions

- **Linting**: ESLint is configured for code quality.
- **Formatting**: Prettier (implied) for consistent indentation and spacing.
- **Comments**: Code is commented where logic is complex, particularly in AI integration and PDF parsing logic.
- **Environment Variables**: Managed via `.env` files (accessed via `process.env` or custom `env.js` loader).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   # Create .env file with GEMINI_API_KEY and PORT
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## ✨ Features

- **AI Resume Analysis**: Detailed scoring and feedback.
- **Dark/Light Mode**: Fully responsive theming.
- **Modern UI**: Built with Shadcn and Aceternity UI for a premium feel.
- **PDF Support**: Direct PDF upload and parsing.
