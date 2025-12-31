import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="p-4 rounded-full bg-muted">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or never existed.
        </p>
        <div className="flex gap-4 mt-6">
          <Button asChild variant="default">
            <Link to="/">Go back home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/resume/analyze">Go to Analyzer</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
