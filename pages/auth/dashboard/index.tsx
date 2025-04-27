'use client';

import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
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
				<h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
				<p className="mb-6 text-gray-600">
					You need to be logged in to view the dashboard.
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
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<h1 className="text-xl font-semibold text-gray-900">
						Live Ops Dashboard
					</h1>
					<div className="flex items-center space-x-4">
						<Link
							href="/auth/profile"
							className="text-sm text-indigo-600 hover:text-indigo-800"
						>
							Profile
						</Link>
						<Link
							href="/"
							className="text-sm text-gray-600 hover:text-gray-800"
						>
							Home
						</Link>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="py-10">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-8">
						<h2 className="text-lg font-medium">
							Welcome, {user.firstName || 'User'}!
						</h2>
						<p className="text-sm text-gray-600">
							This is your protected dashboard area. Only authenticated users
							can see this.
						</p>
					</div>

					{/* Dashboard cards */}
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{/* Active Campaigns */}
						<div className="overflow-hidden rounded-lg bg-white shadow">
							<div className="border-b border-gray-200 px-4 py-5 sm:px-6">
								<h3 className="text-base font-medium text-gray-900">
									Active Campaigns
								</h3>
							</div>
							<div className="px-4 py-5 sm:p-6">
								<div className="text-3xl font-bold text-indigo-600">3</div>
								<p className="mt-2 text-sm text-gray-600">
									Running promotions and events
								</p>
								<div className="mt-4">
									<button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
										View all campaigns →
									</button>
								</div>
							</div>
						</div>

						{/* User Statistics */}
						<div className="overflow-hidden rounded-lg bg-white shadow">
							<div className="border-b border-gray-200 px-4 py-5 sm:px-6">
								<h3 className="text-base font-medium text-gray-900">
									User Statistics
								</h3>
							</div>
							<div className="px-4 py-5 sm:p-6">
								<div className="text-3xl font-bold text-indigo-600">5,234</div>
								<p className="mt-2 text-sm text-gray-600">
									Active users this week
								</p>
								<div className="mt-4">
									<button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
										View analytics →
									</button>
								</div>
							</div>
						</div>

						{/* Store Performance */}
						<div className="overflow-hidden rounded-lg bg-white shadow">
							<div className="border-b border-gray-200 px-4 py-5 sm:px-6">
								<h3 className="text-base font-medium text-gray-900">
									Store Performance
								</h3>
							</div>
							<div className="px-4 py-5 sm:p-6">
								<div className="text-3xl font-bold text-indigo-600">
									$12,543
								</div>
								<p className="mt-2 text-sm text-gray-600">Revenue this month</p>
								<div className="mt-4">
									<button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
										View sales data →
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Recent Activity */}
					<div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
						<div className="border-b border-gray-200 px-4 py-5 sm:px-6">
							<h3 className="text-base font-medium text-gray-900">
								Recent Activity
							</h3>
						</div>
						<ul className="divide-y divide-gray-200">
							<li className="px-4 py-4 sm:px-6">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium text-indigo-600">
										New promotion created
									</p>
									<p className="text-sm text-gray-500">2 hours ago</p>
								</div>
								<p className="mt-1 text-sm text-gray-600">
									Summer Sale 2023 campaign was created
								</p>
							</li>
							<li className="px-4 py-4 sm:px-6">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium text-indigo-600">
										User milestone reached
									</p>
									<p className="text-sm text-gray-500">Yesterday</p>
								</div>
								<p className="mt-1 text-sm text-gray-600">
									5,000 active users milestone achieved
								</p>
							</li>
							<li className="px-4 py-4 sm:px-6">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium text-indigo-600">
										Content update
									</p>
									<p className="text-sm text-gray-500">3 days ago</p>
								</div>
								<p className="mt-1 text-sm text-gray-600">
									New game assets uploaded to the store
								</p>
							</li>
						</ul>
					</div>
				</div>
			</main>
		</div>
	);
}
