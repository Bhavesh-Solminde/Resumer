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
    - **Cross-Reference:** Use `grep_search` to find where the component is used in `frontend` or `backend` before modifying it.

3.  **Strict File Editing:**
    - **Tool:** Use `insert_edit_into_file`.
    - **Precision:** Although the tool allows `// ...existing code...`, **minimize its use**. Provide enough context (10-15 lines) around your changes so the insertion is unambiguous.
    - **Verification:** After every edit, you MUST run `get_errors` to verify strict TypeScript compliance.

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
- **Async:** Use `TanStack Query` (React Query) for data fetching if needed, or native `fetch` inside `useEffect` for simple tasks.

---

## 4. ⚙️ Backend Rules (Node + Express)

- **Controller Pattern:**
  ```typescript
  // MANDATORY: Wrap all controllers
  export const handler = asyncHandler(async (req: Request, res: Response) => { ... });
  ```
- **Validation:** `zod` schemas for all inputs.
- **Database:** Mongoose with strict Schema <-> Interface parity.

---

## 5. 🛠 Deployment

- **Frontend:** Vercel (`pnpm build`).
- **Backend:** Render (`pnpm --filter backend build`).
