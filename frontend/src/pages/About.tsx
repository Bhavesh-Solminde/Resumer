import React from "react";
import { Users, Target, Sparkles, Shield, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-4 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <Home className="h-4 w-4" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            About Resumer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to help job seekers create impactful resumes that
            get past ATS systems and land interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="flex gap-4 p-6 rounded-xl border">
            <Target className="h-8 w-8 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">ATS-Optimized</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your resume against ATS requirements and
                optimizes it for maximum compatibility with applicant tracking
                systems.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-xl border">
            <Sparkles className="h-8 w-8 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Powered by Google's Gemini AI, we provide intelligent
                suggestions to improve your resume's impact and clarity.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-xl border">
            <Users className="h-8 w-8 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">JD Matching</h3>
              <p className="text-sm text-muted-foreground">
                Tailor your resume to specific job descriptions. Our AI
                identifies keyword gaps and optimizes your content accordingly.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-xl border">
            <Shield className="h-8 w-8 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                Your resume data is encrypted and never shared. We process it
                only to provide our optimization services.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>How It Works</h2>
          <ol>
            <li>
              <strong>Upload your resume</strong> — We accept PDF files and
              extract the text for analysis.
            </li>
            <li>
              <strong>Get your ATS score</strong> — Our AI evaluates your resume
              against industry standards and provides a detailed score.
            </li>
            <li>
              <strong>Optimize</strong> — Choose general optimization or
              JD-based optimization to improve your resume's effectiveness.
            </li>
            <li>
              <strong>Build & Export</strong> — Use our drag-and-drop resume
              builder to create a professionally formatted resume and export as
              PDF.
            </li>
          </ol>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
