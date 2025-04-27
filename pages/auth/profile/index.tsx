'use client';

import { UserButton, UserProfile, useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center text-center">
				<h1 className="mb-4 text-2xl font-bold">Not logged in</h1>
				<p className="mb-6 text-gray-600">
					You need to be logged in to view this page.
				</p>
				<Link
					href="/auth/sign-in"
					className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
				>
					Sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="text-2xl font-bold">Profile</h1>
					<Link
						href="/auth/dashboard"
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
					>
						Back to Dashboard
					</Link>
				</div>

				<div className="overflow-hidden rounded-lg bg-white shadow">
					<div className="flex items-center border-b border-gray-200 px-6 py-4">
						<div className="mr-4 h-16 w-16 overflow-hidden rounded-full">
							<img
								src={user.imageUrl}
								alt={user.fullName || 'User'}
								className="h-full w-full object-cover"
							/>
						</div>
						<div>
							<h2 className="text-xl font-semibold">{user.fullName}</h2>
							<p className="text-gray-600">
								{user.primaryEmailAddress?.emailAddress}
							</p>
						</div>
					</div>

					<div className="p-6">
						<div className="mb-6">
							<h3 className="mb-4 text-lg font-medium">Account Details</h3>
							<dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
								<div>
									<dt className="text-sm font-medium text-gray-500">
										First Name
									</dt>
									<dd className="mt-1 text-sm text-gray-900">
										{user.firstName || '-'}
									</dd>
								</div>
								<div>
									<dt className="text-sm font-medium text-gray-500">
										Last Name
									</dt>
									<dd className="mt-1 text-sm text-gray-900">
										{user.lastName || '-'}
									</dd>
								</div>
								<div>
									<dt className="text-sm font-medium text-gray-500">
										Email Address
									</dt>
									<dd className="mt-1 text-sm text-gray-900">
										{user.primaryEmailAddress?.emailAddress}
									</dd>
								</div>
								<div>
									<dt className="text-sm font-medium text-gray-500">
										Account Created
									</dt>
									<dd className="mt-1 text-sm text-gray-900">
										{new Date(user.createdAt).toLocaleDateString()}
									</dd>
								</div>
							</dl>
						</div>

						<div className="flex items-center justify-between border-t border-gray-200 pt-6">
							<Link
								href="/"
								className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
							>
								Back to Home
							</Link>
							<div className="flex items-center">
								<span className="mr-2 text-sm font-medium text-gray-700">
									Sign out:
								</span>
								<UserButton afterSignOutUrl="/auth/sign-in" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
