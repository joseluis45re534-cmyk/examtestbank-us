import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

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
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <div className="overflow-hidden">
                        <h3 className="font-semibold">Something went wrong</h3>
                        <p className="text-sm mt-1 mb-2">The PayPal component crashed.</p>
                        <pre className="text-xs bg-white/50 p-2 rounded overflow-auto max-w-full">
                            {this.state.error?.message}
                        </pre>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
