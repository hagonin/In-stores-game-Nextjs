'use client';

import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function SignInPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white">
			<div className="w-full max-w-md">
				{/* Logo at the top */}
				<div className="mb-8 flex justify-center">
					<Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
				</div>

				<h1 className="mb-8 text-center text-3xl font-bold">Log in</h1>

				{/* Using Clerk's SignIn component */}
				<div className="rounded-lg bg-white px-6 py-8">
					<SignIn />
				</div>

				<div className="mt-6 flex justify-between text-sm">
					<Link
						href="/auth/sign-up"
						className="text-gray-600 hover:text-gray-900"
					>
						Don&apos;t have an account?
					</Link>
					<Link
						href="/auth/forgot-password"
						className="text-gray-600 hover:text-gray-900"
					>
						Forgot password?
					</Link>
				</div>

				<div className="mt-6 text-center text-sm">
					<Link href="/auth/sso" className="text-gray-600 hover:text-gray-900">
						Log in with SSO
					</Link>
				</div>
			</div>
		</div>
	);
}
