'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';

// Custom error type for API errors
export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

interface ApiErrorBoundaryProps {
	children: ReactNode;
	fallback?: (error: ApiError | Error, resetError: () => void) => ReactNode;
}

interface ApiErrorBoundaryState {
	hasError: boolean;
	error: ApiError | Error | null;
}

export class ApiErrorBoundary extends Component<
	ApiErrorBoundaryProps,
	ApiErrorBoundaryState
> {
	constructor(props: ApiErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
		};
	}

	static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// Log to error tracking service or console
		console.error('API Error caught by ApiErrorBoundary:', error, errorInfo);
	}

	resetError = (): void => {
		this.setState({ hasError: false, error: null });
	};

	render(): ReactNode {
		if (this.state.hasError) {
			// Use custom fallback if provided
			if (this.props.fallback && this.state.error) {
				return this.props.fallback(this.state.error, this.resetError);
			}

			// Default fallback UI for API errors
			let title = 'Something went wrong';
			let description = 'We encountered an error fetching data';

			const error = this.state.error;
			if (error instanceof ApiError) {
				if (error.status === 401 || error.status === 403) {
					title = 'Authentication Error';
					description = 'You do not have permission to access this resource';
				} else if (error.status === 404) {
					title = 'Not Found';
					description = 'The requested resource was not found';
				} else if (error.status >= 500) {
					title = 'Server Error';
					description = 'Our servers are currently experiencing issues';
				}
			}

			return (
				<div className="min-h-[300px] w-full flex items-center justify-center p-4">
					<div className="bg-red-50 rounded-lg p-6 max-w-md w-full">
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
						<h3 className="mt-4 text-lg font-medium text-red-800 text-center">
							{title}
						</h3>
						<p className="mt-2 text-sm text-red-700 text-center">
							{description}
						</p>
						<p className="mt-1 text-xs text-red-600 text-center">
							{error?.message}
						</p>
						<div className="mt-6 flex justify-center">
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
