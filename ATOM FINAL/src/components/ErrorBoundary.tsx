import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-wider">Application Notice</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected display error occurred. Please reload the console to reset your view.
              </p>
              {this.state.error?.message && (
                <p className="text-[10px] font-mono text-red-400/80 bg-red-950/30 p-2.5 rounded-xl border border-red-900/30 truncate mt-3">
                  {this.state.error.message}
                </p>
              )}
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Console</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
