import React from "react";
import { Spotlight } from "../components/ui/spotlight";
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { StarsBackground } from "../components/ui/stars-background";
import { ShootingStars } from "../components/ui/shooting-stars";
import { Timeline } from "../components/ui/timeline";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "motion/react";
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
  ArrowRight,
  Upload,
  Wand2,
  FileCheck,
  ChevronRight,
  CheckCircle2,
  Zap,
  Menu,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */
const AnimatedNumber: React.FC<{ target: number; suffix?: string }> = ({
  target,
  suffix = "",
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  Gradient skeleton for bento items                                  */
/* ------------------------------------------------------------------ */
const GradientSkeleton: React.FC<{ from: string; to: string }> = ({
  from,
  to,
}) => (
  <div
    className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br ${from} ${to} opacity-80`}
  />
);

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  /* ---- Timeline data ---- */
  const timelineData = [
    {
      title: "Upload",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base font-normal">
            Drop your existing resume PDF or start fresh with our builder. We
            support all standard formats.
          </p>
          <div className="flex flex-wrap gap-2">
            {["PDF Upload", "Drag & Drop", "Start from Scratch"].map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="text-xs md:text-sm"
              >
                {t}
              </Badge>
            ))}
          </div>
          <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg">
            <img
              src="/upload-dark.png"
              alt="Upload resume"
              loading="lazy"
              className="w-full object-cover dark:hidden"
            />
            <img
              src="/upload-light.png"
              alt="Upload resume"
              loading="lazy"
              className="w-full object-cover hidden dark:block"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Analyze",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base font-normal">
            Our Gemini-powered AI scans your resume for ATS compatibility,
            keyword gaps, formatting issues, and gives you an instant 0-100
            score.
          </p>
          <div className="flex flex-wrap gap-2">
            {["ATS Score", "Keywords", "Format Check", "Actionable Tips"].map(
              (t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="text-xs md:text-sm"
                >
                  {t}
                </Badge>
              )
            )}
          </div>
          <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg">
            <img
              src="/Analyze-dark.png"
              alt="Analysis"
              loading="lazy"
              className="w-full object-cover dark:hidden"
            />
            <img
              src="/Analyze-light.png"
              alt="Analysis"
              loading="lazy"
              className="w-full object-cover hidden dark:block"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Land the Job",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base font-normal">
            Optimize with AI suggestions, build polished resumes with our
            drag-and-drop builder, and export ATS-friendly PDFs — ready to
            impress.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "AI Optimization",
              "Diff View",
              "Multiple Templates",
              "PDF Export",
            ].map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="text-xs md:text-sm"
              >
                {t}
              </Badge>
            ))}
          </div>
          <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg">
            <img
              src="/ResumeBuilder.jpg"
              alt="Resume Builder"
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Offer Banner */}
      <OfferBanner />

      {/* ======================== NAVBAR ======================== */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center py-3 px-4 sm:py-4 sm:px-6 max-w-7xl mx-auto">
          <div className="font-bold text-xl flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              R
            </div>
            <span>Resumer</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#showcase"
              className="hover:text-foreground transition-colors"
            >
              Showcase
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth/login")}
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/auth/signup")}
              className="hidden sm:inline-flex rounded-full"
            >
              Get Started <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {["features", "how-it-works", "showcase"].map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors capitalize"
                >
                  {id.replace(/-/g, " ")}
                </a>
              ))}
              <hr className="my-1 border-border/40" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/auth/login");
                }}
                className="justify-start"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/auth/signup");
                }}
                className="rounded-full"
              >
                Get Started <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ======================== HERO ======================== */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill={theme === "dark" ? "#6366f1" : "#3b82f6"}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="px-4 py-1.5 text-sm border-primary/30 text-primary"
            >
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              Powered by Google Gemini AI
            </Badge>
          </motion.div>

          <TextGenerateEffect
            words="Build. Analyze. Optimize. Land Your Dream Job."
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            duration={0.4}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2"
          >
            Get instant ATS scoring, AI-powered resume optimization, and build
            stunning professional resumes — all in one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth/signup")}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              Start for Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full"
            >
              See How It Works
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground"
          >
            {[
              "No credit card required",
              "Free credits on signup",
              "ATS-optimized output",
            ].map((text) => (
              <div key={text} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================== STATS BAR ======================== */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 py-8 sm:py-12 px-4 sm:px-6">
          {[
            { value: 1000, suffix: "+", label: "Resumes Analyzed" },
            { value: 95, suffix: "%", label: "ATS Pass Rate" },
            { value: 2, suffix: "x", label: "More Interviews" },
            { value: 500, suffix: "+", label: "Happy Users" },
          ].map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <div className="text-3xl md:text-4xl font-bold text-foreground">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================== FEATURES BENTO ======================== */}
      <section id="features" className="py-12 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4">
            <Badge variant="outline" className="px-4 py-1.5 text-sm">
              Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg px-2">
              From AI analysis to drag-and-drop building — a complete toolkit to
              land your dream job.
            </p>
          </div>

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
        </div>
      </section>

      {/* ======================== HOW IT WORKS (TIMELINE) ======================== */}
      <section id="how-it-works" className="bg-muted/20">
        <Timeline data={timelineData}>
          <div className="space-y-4">
            <Badge variant="outline" className="px-4 py-1.5 text-sm">
              How It Works
            </Badge>
            <h2 className="text-lg md:text-4xl font-bold text-foreground max-w-4xl">
              Three steps to your perfect resume
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Upload your resume, let AI analyze and optimize it, and walk into
              your next interview with confidence.
            </p>
          </div>
        </Timeline>
      </section>

      {/* ======================== SHOWCASE ======================== */}
      <section id="showcase" className="py-12 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4">
            <Badge variant="outline" className="px-4 py-1.5 text-sm">
              See It in Action
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground">
              Powerful Tools, Beautiful Results
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg px-2">
              A glimpse at the tools that make your resume stand out from the
              crowd.
            </p>
          </div>

          <div className="space-y-16 md:space-y-32">
            {/* Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
            >
              <div className="flex-1 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">
                  <BarChart3 className="h-4 w-4" />
                  AI Analysis
                </div>
                <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground">
                  Instant ATS Scoring &amp; Feedback
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Upload your PDF resume and get a detailed ATS compatibility
                  score, missing keywords, formatting issues, and actionable
                  improvement tips — all powered by Google Gemini AI.
                </p>
                <Button
                  variant="link"
                  onClick={() => navigate("/auth/signup")}
                  className="p-0 text-blue-500 hover:text-blue-600"
                >
                  Try it free <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="/Analyze.jpg"
                    alt="Resume Analysis Dashboard"
                    loading="lazy"
                    className="rounded-2xl border border-border shadow-2xl shadow-black/10 dark:shadow-black/30"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Optimization */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-12"
            >
              <div className="flex-1 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  Smart Optimization
                </div>
                <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground">
                  Tailor to Any Job Description
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Optimize your resume for specific roles with targeted keyword
                  matching. See exactly what changed with a visual before/after
                  diff comparison in red and green.
                </p>
                <Button
                  variant="link"
                  onClick={() => navigate("/auth/signup")}
                  className="p-0 text-green-500 hover:text-green-600"
                >
                  Optimize now <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="/Optimize(light).jpg"
                    alt="Resume Optimization"
                    loading="lazy"
                    className="rounded-2xl border border-border shadow-2xl shadow-black/10 dark:shadow-black/30 dark:hidden"
                  />
                  <img
                    src="/Optimmize(dark).jpg"
                    alt="Resume Optimization"
                    loading="lazy"
                    className="rounded-2xl border border-border shadow-2xl shadow-black/10 dark:shadow-black/30 hidden dark:block"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Builder */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
            >
              <div className="flex-1 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium">
                  <PenTool className="h-4 w-4" />
                  Resume Builder
                </div>
                <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground">
                  Build from Scratch with Drag &amp; Drop
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Choose from professional templates, customize fonts and
                  colors, rearrange sections with drag-and-drop, and export as a
                  polished ATS-friendly PDF — with full undo/redo support.
                </p>
                <Button
                  variant="link"
                  onClick={() => navigate("/auth/signup")}
                  className="p-0 text-purple-500 hover:text-purple-600"
                >
                  Start building <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="/ResumeBuilder.jpg"
                    alt="Resume Builder"
                    loading="lazy"
                    className="rounded-2xl border border-border shadow-2xl shadow-black/10 dark:shadow-black/30"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================== TESTIMONIALS ======================== */}
      <section className="py-12 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center mb-8 md:mb-12 px-4 space-y-3 md:space-y-4">
          <Badge variant="outline" className="px-4 py-1.5 text-sm">
            Testimonials
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground">
            Trusted by Job Seekers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Join thousands of professionals who boosted their interview rates.
          </p>
        </div>
        <div className="h-[18rem] sm:h-[20rem] md:h-[22rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden bg-neutral-950">
        <StarsBackground className="absolute inset-0" />
        <ShootingStars
          starColor="#6366f1"
          trailColor="#3b82f6"
          minSpeed={15}
          maxSpeed={35}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5 sm:space-y-6 py-12 md:py-24">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400">
            Ready to land your dream job?
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-base sm:text-lg">
            Analyze, optimize, and build professional resumes — powered by AI.
            Join thousands of professionals who have boosted their interview
            rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth/signup")}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 shadow-lg"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth/login")}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full border-neutral-600 text-neutral-300 hover:bg-neutral-800"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Static Data                                                        */
/* ------------------------------------------------------------------ */

const features = [
  {
    title: "AI-Powered Resume Analysis",
    description:
      "Upload any PDF and get an instant ATS compatibility score (0-100) with detailed feedback on content, keywords, and formatting.",
    header: (
      <GradientSkeleton from="from-blue-200" to="to-indigo-100 dark:from-blue-900 dark:to-indigo-950" />
    ),
    icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Smart Optimization Engine",
    description:
      "Enhance your resume with AI suggestions or tailor it to specific job descriptions with targeted keyword matching.",
    header: (
      <GradientSkeleton from="from-green-200" to="to-emerald-100 dark:from-green-900 dark:to-emerald-950" />
    ),
    icon: <Sparkles className="h-4 w-4 text-green-500" />,
  },
  {
    title: "Before/After Diff View",
    description:
      "See exactly what changed with a visual red/green comparison showing improvements and AI reasoning.",
    header: (
      <GradientSkeleton from="from-amber-200" to="to-orange-100 dark:from-amber-900 dark:to-orange-950" />
    ),
    icon: <GitCompareArrows className="h-4 w-4 text-amber-500" />,
  },
  {
    title: "Drag-and-Drop Resume Builder",
    description:
      "Build professional resumes from scratch with multiple templates, customizable styling, section management, and full undo/redo support.",
    header: (
      <GradientSkeleton from="from-purple-200" to="to-pink-100 dark:from-purple-900 dark:to-pink-950" />
    ),
    icon: <PenTool className="h-4 w-4 text-purple-500" />,
  },
  {
    title: "ATS-Friendly PDF Export",
    description:
      "Generate polished, recruiter-ready PDF resumes that pass through Applicant Tracking Systems with ease.",
    header: (
      <GradientSkeleton from="from-cyan-200" to="to-sky-100 dark:from-cyan-900 dark:to-sky-950" />
    ),
    icon: <Download className="h-4 w-4 text-cyan-500" />,
  },
  {
    title: "Scan History & Resume Library",
    description:
      "Access all your previous analyses and optimizations. Manage multiple resume versions for different job applications.",
    header: (
      <GradientSkeleton from="from-rose-200" to="to-red-100 dark:from-rose-900 dark:to-red-950" />
    ),
    icon: <History className="h-4 w-4 text-rose-500" />,
  },
  {
    title: "Secure & Private",
    description:
      "JWT authentication with Google & GitHub OAuth. Your data is encrypted, cookies are HttpOnly, and resume text is never logged.",
    header: (
      <GradientSkeleton from="from-slate-200" to="to-zinc-100 dark:from-slate-900 dark:to-zinc-950" />
    ),
    icon: <Shield className="h-4 w-4 text-slate-500" />,
  },
];

const testimonials = [
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
