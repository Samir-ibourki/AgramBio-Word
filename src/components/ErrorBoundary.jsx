import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FCFAFA] flex items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif text-dark mb-4 italic">
              Oops! Something went wrong
            </h2>
            <p className="text-dark/40 mb-10 leading-relaxed">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-dark text-cream font-bold py-3.5 px-8 rounded-xl hover:bg-gold hover:text-dark transition-all duration-300 tracking-widest uppercase text-sm cursor-pointer"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="border border-black/10 text-dark font-bold py-3.5 px-8 rounded-xl hover:border-gold hover:text-gold transition-all duration-300 tracking-widest uppercase text-sm"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
