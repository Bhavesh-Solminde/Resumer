import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "../components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
          <div className="flex flex-col items-center space-y-4 text-center max-w-md">
            <div className="p-4 rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              We apologize for the inconvenience. An unexpected error has
              occurred.
            </p>
            <div className="p-4 bg-muted rounded-md w-full overflow-auto text-left text-xs font-mono max-h-40">
              {this.state.error?.toString()}
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="default"
              className="mt-4"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
