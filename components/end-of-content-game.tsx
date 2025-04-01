'use client';

import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface EndOfContentProps {
	onScrollToTop: () => void;
}

export function EndOfContent({ onScrollToTop }: EndOfContentProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="text-center py-12 border-t border-gray-200 mt-8"
		>
			<div className="max-w-md mx-auto">
				<div className="mb-6 flex justify-center">
					<div className="w-16 h-1 bg-black rounded-full"></div>
				</div>
				<p className="text-gray-600 mb-6">
					You&apos;ve seen all available games in our collection.
				</p>
				<button
					onClick={onScrollToTop}
					className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all"
				>
					<ArrowUp size={16} />
					Back to top
				</button>
			</div>
		</motion.div>
	);
}
