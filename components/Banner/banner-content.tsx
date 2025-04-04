import { useMediaQuery } from '@/hooks/use-media-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BannerContentProps {
	title: string;
	genres?: string;
	onClick: () => void;
}

export default function BannerContent({
	title,
	genres,
	onClick,
}: BannerContentProps) {
	// Initialize all hooks unconditionally at the top level
	const isDesktopQuery = useMediaQuery('(min-width: 1024px)');

	// States for responsive behavior
	const [isDesktop, setIsDesktop] = useState(false);

	// Update states after hydration
	useEffect(() => {
		setIsDesktop(isDesktopQuery);
	}, [isDesktopQuery]);

	// Define animation variants - only visible state
	const containerVariants = {
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				staggerChildren: 0.1,
				ease: [0.25, 0.1, 0.25, 1.0],
			},
		},
	};

	const itemVariants = {
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3 },
		},
	};

	return (
		<div
			className={`
				p-4 sm:p-5 md:p-6
				${
					!isDesktop
						? 'bg-gradient-to-t from-black/90 via-black/70 to-transparent'
						: 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
				}
				w-full
			`}
		>
			{/* Desktop version */}
			<div className={isDesktop ? 'block' : 'hidden'}>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate="visible"
					variants={containerVariants}
					className="flex flex-col"
				>
					{genres && (
						<motion.div
							variants={itemVariants}
							className="inline-block bg-blue-500/80 backdrop-blur-sm py-1 px-3 rounded-2xl text-white text-xs font-medium tracking-wide mb-2 self-start"
						>
							{genres}
						</motion.div>
					)}

					<motion.h2
						variants={itemVariants}
						className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-white cursor-pointer"
						onClick={onClick}
					>
						{title}
					</motion.h2>

					<motion.button
						variants={itemVariants}
						className="bg-amber-300/90 text-black font-medium py-2 px-5 rounded-3xl self-start text-sm md:text-base transition-colors duration-300 hover:bg-white/90"
						onClick={onClick}
					>
						Play Now →
					</motion.button>
				</motion.div>
			</div>

			{/* Mobile/Tablet version */}
			<div className={!isDesktop ? 'block' : 'hidden'}>
				<div className="flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%] transition-all duration-500 ease-in-out">
					{genres && (
						<div className="inline-block bg-blue-500/90 backdrop-blur-sm py-1 px-3 rounded-2xl text-white text-xs font-medium tracking-wide mb-2 self-start">
							{genres}
						</div>
					)}

					<h2
						className="text-lg sm:text-xl font-bold mb-2 text-white cursor-pointer line-clamp-2"
						onClick={onClick}
					>
						{title}
					</h2>

					<button
						className="bg-amber-300/90 text-black font-medium py-1.5 px-4 rounded-2xl self-start text-xs sm:text-sm transition-colors duration-300 hover:bg-white/90"
						onClick={onClick}
					>
						Play Now →
					</button>
				</div>
			</div>
		</div>
	);
}
