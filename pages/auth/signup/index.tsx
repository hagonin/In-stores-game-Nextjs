'use client';

import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';

export default function SignupPage() {
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
			</div>
		</div>
	);
}
