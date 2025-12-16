# Resumer Frontend

This directory contains the frontend application for **Resumer**, a modern AI-powered resume optimization platform. Built with React 19, Vite, and Tailwind CSS v4, it features a high-performance, visually stunning user interface leveraging Shadcn UI and Aceternity UI components.

## 🎨 Landing Page & UI Design

The landing page (`src/pages/LandingPage.jsx`) is designed to be immersive and engaging, utilizing advanced animation libraries.

### Key Visual Components (Aceternity UI)

The landing page integrates several premium components from Aceternity UI:

1.  **Hero Highlight**:

    - **Usage**: The main hero section.
    - **Effect**: Features a dynamic text highlight animation ("AI Precision") and a smooth fade-in entry for the title and CTA buttons.
    - **Location**: Top of the landing page.

2.  **Bento Grid**:

    - **Usage**: The "Why Choose Resumer?" features section.
    - **Effect**: A responsive, grid-based layout where cards have a subtle hover lift (`hover:-translate-y-1`) and internal content shifts for a 3D feel.
    - **Location**: Middle section.

3.  **Infinite Moving Cards**:

    - **Usage**: The "Trusted by Job Seekers" testimonials section.
    - **Effect**: A smooth, auto-scrolling horizontal list of user reviews.
    - **Location**: Lower middle section.

4.  **Background Beams**:

    - **Usage**: The final Call-to-Action (CTA) footer.
    - **Effect**: Complex, collision-based light beams moving in the background of the "Ready to boost your career?" section.
    - **Location**: Bottom of the page.

5.  **Floating Dock**:
    - **Usage**: The main navigation bar for the authenticated dashboard.
    - **Effect**: A macOS-style floating dock that magnifies icons on hover.
    - **Location**: Fixed at the bottom of the screen in `DashboardLayout`.

### Theming

- **Dark/Light Mode**: Fully supported via a custom `theme-provider`.
- **Color Palette**:
  - **Dark Mode**: Uses a "Neutral" gray scale (Neutral 950/900) to match the Aceternity UI aesthetic seamlessly.
  - **Light Mode**: Uses "Slate 50" for a clean, crisp look.
- **Consistency**: The landing page and dashboard share the same theme tokens to ensure a unified experience.

## 🛠 Tech Stack

- **Core**: React 19, Vite 7.
- **Styling**: Tailwind CSS v4, CSS Variables (`oklch` color space).
- **UI Libraries**:
  - **Shadcn UI**: For atomic components (Buttons, Cards, Badges, Dialogs).
  - **Aceternity UI**: For complex, animated layout components.
  - **Lucide React**: For consistent iconography.
- **Animation**: `framer-motion` (powering Aceternity components).
- **Routing**: `react-router-dom` v7.
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext`).
- **HTTP Client**: Axios.

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # Shadcn & Aceternity components (Button, HeroHighlight, etc.)
│   │   ├── Header.jsx          # Top navigation bar (Logo, Theme Toggle, Profile)
│   │   ├── ResumeAnalysisDisplay.jsx # Core component for showing analysis results
│   │   └── theme-provider.jsx  # Context provider for Dark/Light mode
│   ├── layouts/
│   │   └── DashboardLayout.jsx # Wrapper for app pages (includes Header & Floating Dock)
│   ├── lib/
│   │   └── utils.js            # CN utility for Tailwind class merging
│   ├── pages/
│   │   ├── LandingPage.jsx     # Public marketing page
│   │   ├── Analyze.jsx         # Main resume upload & analysis page
│   │   ├── Optimize.jsx        # Resume optimization tools
│   │   └── Profile.jsx         # User profile settings
│   ├── App.jsx                 # Main router configuration
│   └── index.css               # Global styles & Tailwind theme variables
├── vite.config.js              # Vite configuration (aliases, plugins)
└── package.json                # Dependencies
```

## 🚀 Running the Frontend

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Start Development Server**:

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:5173` (or the next available port).

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🧩 Key Features

- **Resume Upload**: Drag-and-drop PDF upload.
- **Real-time Analysis**: Displays score, detected skills, missing keywords, and formatting errors.
- **Interactive Dashboard**: Easy navigation between Analysis, Optimization, and Profile tools.
- **Responsive Design**: Fully optimized for mobile and desktop views.
