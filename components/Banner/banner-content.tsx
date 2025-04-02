import { useMediaQuery } from '@/hooks/use-media-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BannerContentProps {
	title: string;
	genres?: string;
	isHovered?: boolean;
}

export default function BannerContent({
	title,
	genres,
	isHovered = false,
}: BannerContentProps) {
	// Initialize all hooks unconditionally at the top level
	const isDesktopQuery = useMediaQuery('(min-width: 1024px)');
	const isMobileQuery = useMediaQuery('(max-width: 640px)');

	// States for responsive behavior
	const [isDesktop, setIsDesktop] = useState(false);

	// Update states after hydration
	useEffect(() => {
		setIsDesktop(isDesktopQuery);
	}, [isDesktopQuery, isMobileQuery]);

	// Define animation variants
	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { staggerChildren: 0.1, delayChildren: 0.1 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div
			className={`
				p-4 sm:p-5 md:p-6
				${!isDesktop ? 'bg-gradient-to-t from-black via-black/70 to-transparent' : ''}
			`}
		>
			{/* Desktop version */}
			<div className={isDesktop ? 'block' : 'hidden'}>
				<motion.div
					initial="hidden"
					animate={isHovered ? 'visible' : 'hidden'}
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
					>
						{title}
					</motion.h2>
				</motion.div>
			</div>

			{/* Mobile/Tablet version - always visible with no animation */}
			<div className={!isDesktop ? 'block' : 'hidden'}>
				<div className="flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%]">
					{genres && (
						<div className="inline-block bg-blue-500/90 backdrop-blur-sm py-1 px-3 rounded-2xl text-white text-xs font-medium tracking-wide mb-2 self-start">
							{genres}
						</div>
					)}

					<h2 className="text-lg sm:text-xl font-bold mb-2 text-white cursor-pointer line-clamp-2">
						{title}
					</h2>
				</div>
			</div>
		</div>
	);
}
