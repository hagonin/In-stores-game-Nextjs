import { useMediaQuery } from '@/hooks/use-media-query';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerNavigationProps {
	totalBanners: number;
	currentBanner: number;
	onNext: () => void;
	onPrev: () => void;
	onGoTo: (index: number) => void;
}

export default function BannerNavigation({
	totalBanners,
	currentBanner,
	onNext,
	onPrev,
	onGoTo,
}: BannerNavigationProps) {
	// Use media query to determine the device size
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<div className="absolute inset-0 z-10 pointer-events-none">
			{/* Centered Dots - Only visible on desktop  */}
			{isDesktop && (
				<div className="absolute bottom-6 right-3 transform -translate-x-1/2 pointer-events-auto">
					<div className="flex items-center gap-2">
						{Array.from({ length: totalBanners }).map((_, index) => (
							<button
								key={`indicator-${index}`}
								className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
									currentBanner === index
										? 'w-10 bg-white'
										: 'w-2.5 bg-white/50 hover:bg-white/80'
								}`}
								onClick={() => onGoTo(index)}
								aria-label={`Go to banner ${index + 1}`}
							/>
						))}
					</div>
				</div>
			)}

			{/* Navigation buttons with animation */}
			<AnimatePresence initial={false}>
				<motion.button
					key="prev-button"
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.7 }}
					exit={{ opacity: 0 }}
					whileHover={{ opacity: 1 }}
					className="absolute left-2 top-1/2 -mt-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white shadow-lg hover:bg-black/50 focus:outline-none pointer-events-auto"
					onClick={onPrev}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</motion.button>

				<motion.button
					key="next-button"
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.7 }}
					exit={{ opacity: 0 }}
					whileHover={{ opacity: 1 }}
					className="absolute right-2 top-1/2 -mt-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white shadow-lg hover:bg-black/50 focus:outline-none pointer-events-auto"
					onClick={onNext}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</motion.button>
			</AnimatePresence>
		</div>
	);
}
