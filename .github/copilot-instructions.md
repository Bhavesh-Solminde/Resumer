# 🤖 Project Instructions: "Resumer" (Gemini 3 / Opus 4.5 Edition)

You are an expert AI developer working on **"Resumer"** (Resume Optimizer).
You are powered by a High-Reasoning Model. Do not be lazy. Be architectural.

## 0. 🧠 Reasoning & Planning (MANDATORY)

1.  **Chain of Thought:**

    - **STOP & THINK:** Before writing a single line of code, analyze the dependency tree.
    - **Plan First:** If a task touches >1 file, outline your plan in 3 bullet points before executing.
    - **No "Lazy" Fixes:** Do not just patch the error. Fix the root cause.

2.  **Context Strategy (High-Capacity):**

    - **READ FULL FILES:** You have a massive context window. **Always read the entire file** (`read_file`) before editing to ensure you see imports, types, and exported interfaces.
    - **Cross-Reference:** Before modifying code, perform a project-wide search (for example, via your editor’s search or a CLI tool like `grep`/`rg`) to find where the component , function, or type is used in `frontend` or `backend` .

3.  **Strict File Editing:**
    - **Edits:** Apply changes using your environment’s structured editing or patch mechanism (for example, providing clear before/after code blocks) rather than ad-hoc snippets.
    - **Precision:** Even if your editing tooling allows placeholders like `// ...existing code...`, **minimize their use**. Provide enough surrounding context (10–15 lines) around your changes so the insertion is unambiguous.
    - **Verification:** After every edit, ensure the project still type-checks and builds (for example, by running the appropriate TypeScript, lint, and test commands for this repository).

---

## 1. 📂 Monorepo Architecture

- **Root:** `pnpm` workspaces (No Docker).
- **Frontend:** `./frontend` (React 18.3.1, Vite, Tailwind v4).
- **Backend:** `./backend` (Node, Express, ES Modules).
- **Shared:** `packages/shared-types` (linked via `workspace:*`).

**Rule:** explicit check—Are we in `frontend` or `backend`? Do not mix imports.

---

## 2. 🚫 Critical Tech Restrictions

- **Language:** **TypeScript ONLY.** Strict Mode (`interface`, `type`).
- **Modules:** **ES Modules** (`import` / `export`) everywhere. NO `require`.
- **Backend Imports:** **MUST include `.js` extension** for local imports (e.g., `import ENV from "../env.js"`).
- **Framework:** **Vite + React Router** (Not Next.js).
  - ❌ No `next/*` imports.
  - ✅ Use `react-router-dom` hooks (`useNavigate`, `useParams`).

---

## 3. 🎨 Frontend Rules (Vite + React 18)

- **State:**
  - **Zustand:** Global store.
  - **Zundo:** Temporal middleware for Undo/Redo.
- **UI Engine:** Tailwind CSS v4 + `clsx`/`tailwind-merge` (via `cn()` utility).
- **Components:**
  - **Shadcn UI:** Atoms in `@/components/ui`.
  - **Aceternity:** Complex layouts.
- **API:** Use `axiosInstance` from `@/lib/axios` (handles `withCredentials`).
- **Types:** Import shared types from `@resumer/shared-types`.

---

## 4. ⚙️ Backend Rules (Node + Express)

- **Controller Pattern:**
  ```typescript
  // MANDATORY: Wrap all controllers
  import asyncHandler from "../utils/asyncHandler.js";
  export const handler = asyncHandler(async (req: Request, res: Response) => { ... });
  ```
- **Validation:** Currently manual (Interfaces + Regex).
- **Database:** Mongoose with strict Schema <-> Interface parity.
- **Environment:** Use `ENV` object from `src/env.ts`, do not use `process.env` directly in business logic.
- **Types:** Currently defines local interfaces (e.g., `RegisterBody`) in controllers. _Goal: Refactor to use `@resumer/shared-types`._

---

& Scripts

- **Frontend:** `pnpm build` (Vercel).
- **Backend:** `pnpm --filter backend build` (Render).
- **Dev:** `pnpm dev` (runs parallel
- **Backend:** Render (`pnpm --filter backend build`).
