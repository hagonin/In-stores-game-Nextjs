'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SSOPage() {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			setError('Please enter your work email address');
			return;
		}

		setIsLoading(true);

		// This would normally redirect to the appropriate SSO provider
		// For demo purposes, we'll just simulate loading
		setTimeout(() => {
			setIsLoading(false);
			window.location.href = '/auth/dashboard';
		}, 1500);
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white">
			<div className="w-full max-w-md">
				{/* Logo at the top */}
				<div className="mb-8 flex justify-center">
					<Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
				</div>

				<h1 className="mb-8 text-center text-3xl font-bold">Log in with SSO</h1>

				<div className="rounded-lg bg-white px-6 py-8 shadow-sm">
					<p className="mb-6 text-center text-gray-600">
						Enter your work email to log in with your company&apos;s Single
						Sign-On provider.
					</p>

					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">
								Work email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								placeholder="you@company.com"
							/>
							{error && <p className="mt-1 text-xs text-red-500">{error}</p>}
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className={`w-full rounded-md bg-indigo-600 px-4 py-2 text-white ${
								isLoading
									? 'opacity-70 cursor-not-allowed'
									: 'hover:bg-indigo-700'
							}`}
						>
							{isLoading ? (
								<span className="flex items-center justify-center">
									<svg
										className="mr-2 h-4 w-4 animate-spin"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Processing...
								</span>
							) : (
								'Continue with SSO'
							)}
						</button>
					</form>

					<div className="mt-6 text-center">
						<Link
							href="/auth/sign-in"
							className="text-sm text-indigo-600 hover:text-indigo-800"
						>
							Back to login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
