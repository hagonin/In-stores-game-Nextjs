'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			setError('Please enter your email address');
			return;
		}

		// Here you would normally call Clerk's password reset functionality
		// For demo purposes, we'll just show the success message
		setIsSubmitted(true);
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white">
			<div className="w-full max-w-md">
				{/* Logo at the top */}
				<div className="mb-8 flex justify-center">
					<Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
				</div>

				<h1 className="mb-8 text-center text-3xl font-bold">Reset Password</h1>

				<div className="rounded-lg bg-white px-6 py-8 shadow-sm">
					{!isSubmitted ? (
						<>
							<p className="mb-6 text-center text-gray-600">
								Enter your email address and we'll send you a link to reset your
								password.
							</p>

							<form onSubmit={handleSubmit}>
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700">
										Email address
									</label>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										placeholder="your.email@example.com"
									/>
									{error && (
										<p className="mt-1 text-xs text-red-500">{error}</p>
									)}
								</div>

								<button
									type="submit"
									className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
								>
									Send reset link
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
						</>
					) : (
						<div className="text-center">
							<svg
								className="mx-auto h-12 w-12 text-green-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<h3 className="mt-2 text-xl font-medium text-gray-900">
								Check your email
							</h3>
							<p className="mt-2 text-sm text-gray-600">
								We've sent a password reset link to{' '}
								<span className="font-medium">{email}</span>
							</p>
							<p className="mt-1 text-sm text-gray-500">
								If you don't see it, please check your spam folder
							</p>
							<div className="mt-6">
								<Link
									href="/auth/sign-in"
									className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
								>
									Return to sign in
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
