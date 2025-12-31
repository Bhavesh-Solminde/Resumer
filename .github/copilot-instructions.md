# 🤖 Copilot Instructions for "Resumer" Project

You are an expert AI developer working on "Resumer," an AI-powered resume optimizer.
Always follow these architectural and stylistic rules strictly.

## 1. 🚫 Critical Restrictions (Do Not Violate)

- **NO TypeScript:** Use strictly **JavaScript (ES6+)**. Do not use `interface`, `type`, or `: string`.
- **NO Next.js:** This is a **Vite + React Router** project.
  - ❌ No `next/image` (Use `<img>`).
  - ❌ No `next/link` (Use `Link` from `react-router-dom`).
  - ❌ No `next/navigation` (Use `react-router-dom` hooks).
- **NO CommonJS:** Use **ES Modules** (`import/export`) exclusively, even in the Backend.

## 2. 📂 Project Structure (Monorepo)

- **Frontend:** `./frontend` (React 19, Vite, Tailwind v4)
- **Backend:** `./backend` (Node, Express, ES Modules)
  _Context Awareness:_ Before generating code, check if the user is asking about the Frontend or Backend.

---

## 3. 🎨 Frontend Rules (React 19 + Vite)

### UI & Styling

- **Styling Engine:** Tailwind CSS v4.
- **Component Libraries:**
  - **Shadcn UI:** Reusable atoms (Buttons, Inputs). Place in `src/components/ui`.
  - **Aceternity UI:** Complex animations (Hero, Bento Grid). Place in `src/components/ui` or `src/components/aceternity`.
  - **Utils:** Always use the `cn()` utility for class merging: `import { cn } from "../lib/utils"` (use relative paths).
- **Icons:** Use `lucide-react`.
- **Imports:** Use **relative paths only**. Do NOT use `@/` alias (e.g., use `../ui/button` not `@/components/ui/button`).

### Architecture & Routing

- **Routing:** Use `react-router-dom` v7.
- **Dev Server:** Frontend always runs on `localhost:5173`. Do NOT use other ports.
- **Directories:**
  - `src/components/ui`: Shadcn/Aceternity base components.
  - `src/pages`: Full page views.
  - `src/layouts`: Layout wrappers (Navbar/Footer).
- **Naming:**
  - Components: PascalCase (`ResumeAnalysis.jsx`).
  - Hooks: camelCase (`useResumeScore.js`).

---

## 4. ⚙️ Backend Rules (Node + Express)

### Architecture

- **Pattern:** MVC (Controller-Route pattern).
- **Module System:** **ES Modules** (`import` / `export default`). Do NOT use `require()`.
- **Error Handling:** **MANDATORY**: Wrap all async controller functions in `asyncHandler`.
  ```javascript
  // Example
  export const analyzeResume = asyncHandler(async (req, res) => { ... });
  ```
