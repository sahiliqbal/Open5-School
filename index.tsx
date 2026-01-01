
// Use Component and ErrorInfo from react
import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AlertTriangle, RefreshCcw, Flag, CheckCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isReported: boolean;
}

// ErrorBoundary class component to catch rendering errors.
// Inheriting from Component<Props, State> automatically provides setState, this.props, and this.state.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Initialize state using class field syntax, which is the standard approach in modern React with TypeScript
  state: ErrorBoundaryState = { 
    hasError: false, 
    error: null, 
    isReported: false 
  };
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, isReported: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  // Use arrow function to maintain 'this' context; setState is inherited from Component.
  handleReport = () => {
    console.log("User reported error:", this.state.error);
    this.setState({ isReported: true });
  };

  handleReload = () => {
    localStorage.clear(); 
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center mb-8 shadow-sm border border-red-100 animate-in fade-in zoom-in duration-500">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Oops! Something went wrong.</h1>
          <p className="text-slate-500 mb-10 max-w-sm leading-relaxed font-medium">
            We encountered an unexpected error. Please try reloading the application or report this issue to our support team.
          </p>

          <div className="space-y-4 w-full max-w-xs">
            <button 
              onClick={this.handleReload}
              className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-bold text-lg shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              Reload App
            </button>
            
            <button 
              onClick={this.handleReport}
              disabled={this.state.isReported}
              className={`w-full py-4 bg-white border-2 rounded-[20px] font-bold text-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                  this.state.isReported 
                  ? 'border-emerald-100 text-emerald-600 bg-emerald-50 cursor-default' 
                  : 'border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              {this.state.isReported ? (
                  <><CheckCircle size={20} /> Report Sent</>
              ) : (
                  <><Flag size={20} /> Report Issue</>
              )}
            </button>
          </div>

          {/* Technical Details (Collapsible) */}
          <div className="mt-12 w-full max-w-md opacity-80 hover:opacity-100 transition-opacity">
            <details className="text-left bg-white border border-slate-100 rounded-2xl overflow-hidden group">
                <summary className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wide cursor-pointer hover:bg-slate-50 transition-colors select-none flex justify-between items-center outline-none">
                    <span>View Technical Details</span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 bg-slate-50 border-t border-slate-100 overflow-x-auto">
                    <pre className="text-[10px] text-red-600 font-mono whitespace-pre-wrap break-all">
                        {this.state.error?.toString()}
                        {'\n'}
                        {this.state.error?.stack}
                    </pre>
                </div>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
  </React.StrictMode>
);
