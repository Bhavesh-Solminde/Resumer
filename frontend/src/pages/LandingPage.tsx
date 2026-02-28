import React from "react";
import { HeroHighlight, Highlight } from "../components/ui/hero-highlight";
import { BackgroundBeams } from "../components/ui/background-beams";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useTheme } from "../components/theme-provider";
import OfferBanner from "../components/OfferBanner";
import {
  Shield,
  BarChart3,
  Sparkles,
  Moon,
  Sun,
  PenTool,
  History,
  GitCompareArrows,
  Download,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  header: React.ReactNode;
  icon: React.ReactNode;
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleScrollToFeatures = () => {
    const featuresElement = document.getElementById("features");
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Offer Banner */}
      <OfferBanner />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center p-6 max-w-7xl mx-auto bg-background/80 backdrop-blur-sm">
        <div className="font-bold text-xl flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            R
          </div>
          <span>Resumer</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </nav>

      {/* Hero Section */}
      <HeroHighlight containerClassName="h-[40rem] flex flex-col items-center justify-center">
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-4xl md:text-7xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          Build, Analyze &amp; Optimize Your Resume with{" "}
          <Highlight className="text-black dark:text-white">
            AI Precision
          </Highlight>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl text-center mx-auto px-4"
        >
          Get instant ATS scoring, AI-powered optimization, and build
          professional resumes with our drag-and-drop builder — all in one
          platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex gap-4"
        >
          <Button
            size="lg"
            onClick={() => navigate("/auth/signup")}
            className="text-lg px-8 py-6 rounded-full"
          >
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleScrollToFeatures}
            className="text-lg px-8 py-6 rounded-full"
          >
            Learn More
          </Button>
        </motion.div>
      </HeroHighlight>

      {/* Features Section (Bento Grid) */}
      <section id="features" className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-neutral-800 dark:text-neutral-100">
          Everything You Need
        </h2>
        <p className="text-center text-neutral-500 dark:text-neutral-400 mb-12 max-w-2xl mx-auto text-lg">
          From AI analysis to resume building — a complete toolkit to land your
          dream job.
        </p>
        <BentoGrid className="max-w-5xl mx-auto">
          {features.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 0 || i === 3 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </section>

      {/* Showcase Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-neutral-800 dark:text-neutral-100">
          See It in Action
        </h2>
        <p className="text-center text-neutral-500 dark:text-neutral-400 mb-16 max-w-2xl mx-auto text-lg">
          A glimpse at the tools that make your resume stand out.
        </p>

        <div className="space-y-24">
          {/* Analysis Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">
                <BarChart3 className="h-4 w-4" />
                AI Analysis
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                Instant ATS Scoring &amp; Feedback
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed">
                Upload your PDF resume and get a detailed ATS compatibility
                score, missing keywords, formatting issues, and actionable
                improvement tips — all powered by Google Gemini AI.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="/Analyze.jpg"
                alt="Resume Analysis Dashboard"
                loading="lazy"
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Optimization Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse items-center gap-8"
          >
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Smart Optimization
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                Tailor to Any Job Description
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed">
                Optimize your resume for specific roles with targeted keyword
                matching. See exactly what changed with a visual before/after
                diff comparison in red and green.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="/Optimize(light).jpg"
                alt="Resume Optimization"
                loading="lazy"
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl dark:hidden"
              />
              <img
                src="/Optimmize(dark).jpg"
                loading="lazy"
                alt="Resume Optimization"
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl hidden dark:block"
              />
            </div>
          </motion.div>

          {/* Builder Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium">
                <PenTool className="h-4 w-4" />
                Resume Builder
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                Build from Scratch with Drag &amp; Drop
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed">
                Choose from professional templates, customize fonts and colors,
                rearrange sections with drag-and-drop, and export as a polished
                ATS-friendly PDF — with full undo/redo support.
              </p>
            </div>
            <div className="flex-1">
              <img
                loading="lazy"
                src="/ResumeBuilder.jpg"
                alt="Resume Builder"
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-neutral-800 dark:text-neutral-100">
          Trusted by Job Seekers
        </h2>
        <div className="h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-neutral-950 dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4 relative z-10 text-center">
          <h2 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
            Ready to land your dream job?
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Analyze, optimize, and build professional resumes — powered by AI.
            Join thousands of professionals who have boosted their interview
            rates.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth/signup")}
              className="text-lg px-8 py-6 rounded-full bg-neutral-100 text-neutral-950 hover:bg-neutral-200"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth/login")}
              className="text-lg px-8 py-6 rounded-full border-neutral-600 text-neutral-300 hover:bg-neutral-800"
            >
              Sign In
            </Button>
          </div>
        </div>
        <BackgroundBeams />
      </section>
    </div>
  );
};

const Skeleton: React.FC = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const features: Feature[] = [
  {
    title: "AI-Powered Resume Analysis",
    description:
      "Upload any PDF and get an instant ATS compatibility score (0-100) with detailed feedback on content, keywords, and formatting.",
    header: <Skeleton />,
    icon: <BarChart3 className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Smart Optimization Engine",
    description:
      "Enhance your resume with AI suggestions for clarity and impact, or tailor it to specific job descriptions with targeted keyword matching.",
    header: <Skeleton />,
    icon: <Sparkles className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Before/After Diff View",
    description:
      "See exactly what changed with a visual red/green comparison showing improvements and the reasoning behind each change.",
    header: <Skeleton />,
    icon: <GitCompareArrows className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Drag-and-Drop Resume Builder",
    description:
      "Build professional resumes from scratch with multiple templates, customizable styling, section management, and full undo/redo support.",
    header: <Skeleton />,
    icon: <PenTool className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "ATS-Friendly PDF Export",
    description:
      "Generate polished, recruiter-ready PDF resumes that pass through Applicant Tracking Systems with ease.",
    header: <Skeleton />,
    icon: <Download className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Scan History & Resume Library",
    description:
      "Access all your previous analyses and optimizations. Manage multiple resume versions for different job applications.",
    header: <Skeleton />,
    icon: <History className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Secure & Private",
    description:
      "JWT authentication with Google & GitHub OAuth. Your data is encrypted, cookies are HttpOnly, and resume text is never logged.",
    header: <Skeleton />,
    icon: <Shield className="h-4 w-4 text-neutral-500" />,
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Resumer helped me identify key missing keywords. I got 3 interview calls within a week!",
    name: "Sarah Chen",
    title: "Software Engineer",
  },
  {
    quote:
      "The formatting feedback was a lifesaver. My resume looks so much more professional now.",
    name: "Michael Ross",
    title: "Product Manager",
  },
  {
    quote:
      "Simple, fast, and effective. The AI suggestions are surprisingly accurate.",
    name: "Jessica Stark",
    title: "Marketing Director",
  },
  {
    quote:
      "I love the dark mode and the clean interface. Makes working on my resume less stressful.",
    name: "David Kim",
    title: "UX Designer",
  },
  {
    quote:
      "Highly recommended for anyone looking to switch jobs. It gives you a competitive edge.",
    name: "Emily Watson",
    title: "Data Scientist",
  },
];

export default LandingPage;
