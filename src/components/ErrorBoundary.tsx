
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-red-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Qualcosa è andato storto</h1>
            <p className="text-gray-600 mb-8">
              L'applicazione ha riscontrato un errore imprevisto. Non preoccuparti, i tuoi dati sono al sicuro.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Ricarica l'applicazione
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Torna alla home (se possibile)
              </button>
            </div>
            {this.state.error && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left overflow-auto max-h-40">
                <p className="text-xs font-mono text-gray-400 uppercase mb-2">Dettagli tecnici:</p>
                <p className="text-xs font-mono text-red-500 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
