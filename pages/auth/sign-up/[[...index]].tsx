'use client';

import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white">
			<div className="w-full max-w-md">
				{/* Logo at the top */}
				<div className="mb-8 flex justify-center">
					<Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
				</div>

				<h1 className="mb-8 text-center text-3xl font-bold">Sign up</h1>

				{/* Using Clerk's SignUp component */}
				<div className="rounded-lg bg-white px-6 py-8">
					<SignUp />
				</div>

				<div className="mt-6 text-center text-sm">
					<span className="text-gray-600">Already have an account?</span>{' '}
					<Link
						href="/auth/sign-in"
						className="text-indigo-600 hover:text-indigo-800"
					>
						Log in
					</Link>
				</div>
			</div>
		</div>
	);
}
