'use client';

import { UserProfile, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Home, LogOut } from 'lucide-react';

export default function UserProfilePage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white">
			<div className="w-full max-w-4xl">
				{/* Logo at the top */}
				<div className="mb-8 flex justify-center">
					<Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
				</div>

				{/* Header with navigation buttons */}
				<div className="mb-6 flex justify-between items-center">
					<Link href="/">
						<button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors">
							<Home size={16} />
							<span>Back to Home</span>
						</button>
					</Link>

					<h1 className="text-center text-3xl font-bold">Your Profile</h1>

					<SignOutButton redirectUrl="/">
						<button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors">
							<LogOut size={16} />
							<span>Sign Out</span>
						</button>
					</SignOutButton>
				</div>

				{/* Using Clerk's UserProfile component */}
				<div className="rounded-lg bg-white px-6 py-8">
					<UserProfile />
				</div>
			</div>
		</div>
	);
}
