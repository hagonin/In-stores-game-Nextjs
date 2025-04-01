'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

export default function NotFound() {
	return (
		<div className="min-h-screen bg-white">
			<Header />

			{/* Main content */}
			<main className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center px-4"
				>
					{/* 404 Text */}
					<motion.h1
						className="font-mono text-[clamp(120px,25vw,240px)] font-bold leading-none tracking-tighter mb-6"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					>
						404
					</motion.h1>

					{/* Title and Subtitle with staggered animation */}
					<motion.div
						initial="hidden"
						animate="visible"
						variants={{
							hidden: { opacity: 0 },
							visible: {
								opacity: 1,
								transition: {
									staggerChildren: 0.2,
									delayChildren: 0.3,
								},
							},
						}}
					>
						<motion.h2
							className="text-2xl sm:text-3xl font-medium mb-3"
							variants={{
								hidden: { opacity: 0, y: 10 },
								visible: { opacity: 1, y: 0 },
							}}
						>
							There&apos;s NOTHING here...
						</motion.h2>
						<motion.p
							className="text-gray-600 text-base sm:text-lg mb-8 max-w-md mx-auto"
							variants={{
								hidden: { opacity: 0, y: 10 },
								visible: { opacity: 1, y: 0 },
							}}
						>
							...maybe the page you&apos;re looking for is not found or never
							existed.
						</motion.p>
					</motion.div>

					{/* Back to home button with hover animation */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
					>
						<Link
							href="/"
							className="inline-flex items-center px-8 py-3 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-900 transition-all hover:scale-105 hover:shadow-lg"
						>
							Back to home
						</Link>
					</motion.div>
				</motion.div>
			</main>
		</div>
	);
}
