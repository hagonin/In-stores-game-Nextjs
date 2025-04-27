'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
		};
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// You can log the error to an error reporting service
		console.error('Error caught by ErrorBoundary:', error, errorInfo);
	}

	resetError = (): void => {
		this.setState({ hasError: false, error: null });
	};

	render(): ReactNode {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="min-h-[400px] w-full flex items-center justify-center p-6">
					<div className="bg-red-50 rounded-lg p-8 max-w-md w-full text-center">
						<svg
							className="mx-auto h-12 w-12 text-red-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<h3 className="mt-5 text-lg font-medium text-red-800">
							Something went wrong
						</h3>
						<p className="mt-2 text-sm text-red-700">
							{this.state.error?.message || 'An unexpected error occurred'}
						</p>
						<p className="mt-1 text-xs text-red-600">
							{this.state.error?.name}
						</p>
						<div className="mt-6">
							<Button
								variant="default"
								onClick={this.resetError}
								className="bg-red-600 hover:bg-red-700 text-white"
							>
								Try Again
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
