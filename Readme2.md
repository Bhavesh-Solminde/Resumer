# Resumer — AI-Powered Resume Optimizer

Resumer is a modern full-stack application that helps job seekers analyze, optimize, and improve their resumes using AI-powered insights from Google Gemini.

## 🚀 Live Features

### 🔐 Authentication

- **Login / Signup**: Email-based authentication with JWT tokens
- **OAuth Ready**: GitHub and Google OAuth strategies scaffolded
- **Protected Routes**: All dashboard pages require authentication

### 📄 Resume Analysis (`/resume/analyze`)

- **PDF Upload**: Upload your resume as a PDF file
- **AI-Powered Scoring**: Get an ATS compatibility score (0-100)
- **Structured Feedback**: Receive detailed analysis including:
  - Professional summary evaluation
  - Skills assessment
  - Missing keywords detection
  - Formatting issues
  - Actionable improvement tips
- **History Tracking**: View previous scans with thumbnails

### ⚡ Resume Optimization (`/resume/optimize`)

- **Two Optimization Modes**:
  - **General Optimization**: Improve your resume for overall ATS performance
  - **Job Description Match**: Tailor your resume to a specific job posting
- **Before/After Comparison**: See score improvements with visual cards
- **Section-by-Section Suggestions**: Detailed comparison grid with copy-to-clipboard
- **Saves to History**: Each optimization is persisted for future reference

### 👤 User Profile (`/profile`)

- **Profile Management**: Edit name and view account details
- **Password Security**: Update password with current password verification
- **Resume History Grid**: Browse all previous scans with thumbnails
- **Analysis Dialog**: Click any scan to view full AI analysis details

### 🏢 Recruiter View (`/recruiter`)

- Placeholder page for future recruiter-focused tools

### 🔨 Resume Builder (`/resume/build`)

- Placeholder page ready for future development

---

## 🎨 UI/UX Design

### Landing Page

- **Hero Section**: Animated headline with Aceternity UI `HeroHighlight`
- **Features Grid**: `BentoGrid` showcasing key features
- **Testimonials**: `InfiniteMovingCards` with auto-scrolling reviews
- **CTA Footer**: `BackgroundBeams` animation for visual impact

### Dashboard

- **Floating Dock** (Desktop): macOS-style navigation with icon magnification
- **Bottom Nav** (Mobile): Fixed bottom navigation for touch-friendly access
- **Theme Toggle**: Light/Dark mode support across all pages

### Design System

- **Colors**: Semantic tokens (`bg-background`, `text-foreground`, `border-border`)
- **Components**: Shadcn UI primitives (Button, Card, Dialog, Input, Switch, Progress)
- **Animations**: Framer Motion for smooth transitions and loaders
- **Icons**: Lucide React for consistent iconography

---

## 🛠 Tech Stack

### Frontend

| Technology      | Purpose              |
| --------------- | -------------------- |
| React 18        | UI Library           |
| Vite 7          | Build Tool           |
| Tailwind CSS v4 | Styling              |
| Shadcn UI       | Component Library    |
| Aceternity UI   | Animation Components |
| React Router v7 | Routing              |
| Zustand         | State Management     |
| Axios           | HTTP Client          |
| Framer Motion   | Animations           |

### Backend

| Technology         | Purpose                  |
| ------------------ | ------------------------ |
| Node.js            | Runtime                  |
| Express 5          | Web Framework            |
| MongoDB + Mongoose | Database                 |
| Google Gemini AI   | Content Generation       |
| Cloudinary         | PDF Storage & Thumbnails |
| Multer             | File Upload Handling     |
| Passport.js        | OAuth Strategies         |

---

## 📂 Project Structure

```text
Resumer/
├── frontend/
│   ├── src/
│   │   ├── pages/           # Route pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Analyze.jsx
│   │   │   ├── Optimize.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Recruiter.jsx
│   │   │   ├── ResumeBuilder.jsx
│   │   │   └── NotFound.jsx
│   │   ├── components/
│   │   │   ├── ui/          # Shadcn + Aceternity components
│   │   │   ├── analyze/     # Analyze page components
│   │   │   └── profile/     # Profile page components
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── store/           # Zustand stores
│   │   │   ├── Auth.store.js
│   │   │   ├── Resume.store.js
│   │   │   └── History.store.js
│   │   └── lib/
│   │       ├── axios.js
│   │       └── utils.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── analyze.controllers.js
│   │   │   ├── optimize.controllers.js
│   │   │   ├── auth.controllers.js
│   │   │   └── profile.controllers.js
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── lib/
│   │   │   ├── db.js
│   │   │   └── cloudinary.js
│   │   └── utils/
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance
- Cloudinary account
- Google Gemini API key

### Environment Variables

**Backend (`backend/.env`)**

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (`frontend/.env`)**

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Resumer

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the App

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints

| Method | Endpoint                          | Description             |
| ------ | --------------------------------- | ----------------------- |
| POST   | `/api/v1/auth/signup`             | Register new user       |
| POST   | `/api/v1/auth/login`              | Login user              |
| GET    | `/api/v1/auth/check`              | Check auth status       |
| POST   | `/api/v1/resume/analyze`          | Analyze resume PDF      |
| POST   | `/api/v1/resume/optimize/general` | General optimization    |
| POST   | `/api/v1/resume/optimize/jd`      | JD-matched optimization |
| GET    | `/api/v1/profile/history`         | Get user's scan history |
| PUT    | `/api/v1/profile/update`          | Update user profile     |

---

## 🎯 Current Status

| Feature               | Status         |
| --------------------- | -------------- |
| Authentication        | ✅ Complete    |
| Resume Analysis       | ✅ Complete    |
| General Optimization  | ✅ Complete    |
| JD Match Optimization | ✅ Complete    |
| User Profile          | ✅ Complete    |
| Scan History          | ✅ Complete    |
| Resume Builder        | 🚧 Placeholder |
| Recruiter Tools       | 🚧 Placeholder |

---

## 📝 License

MIT License - Feel free to use this project for learning and personal use.
