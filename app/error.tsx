'use client';

import { useEffect } from 'react';
import { Button } from '@/components/UI/button';
import Link from 'next/link';

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error('Global app error:', error);
	}, [error]);

	return (
		<html>
			<body>
				<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
					<div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-md w-full">
						<div className="flex justify-center">
							<div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
								<svg
									className="h-10 w-10 text-red-600"
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
							</div>
						</div>
						<div className="mt-5 text-center">
							<h3 className="text-lg font-medium text-gray-900">
								Something went wrong!
							</h3>
							<div className="mt-2">
								<p className="text-sm text-gray-600">
									{error?.message || 'An unexpected error occurred'}
								</p>
								{error?.digest && (
									<p className="mt-1 text-xs text-gray-500">
										Error ID: {error.digest}
									</p>
								)}
							</div>
							<div className="mt-6">
								<Button
									onClick={reset}
									className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
								>
									Try again
								</Button>
							</div>
							<div className="mt-4">
								<Link href="/" className="text-sm text-red-600 hover:text-red-800">
									Return to home page
								</Link>
							</div>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
