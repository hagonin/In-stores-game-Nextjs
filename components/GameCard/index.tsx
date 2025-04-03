'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import type { Game } from '@/lib/types';
import { CardImage } from './card-image';
import { useHover } from '@/hooks/use-hover';
import { useMediaQuery } from '@/hooks/use-media-query';

interface GameCardProps {
	game: Game;
	size?: 'normal' | 'large' | 'small';
}

// Animation variants for card components
const cardVariants = {
	initial: { scale: 1 },
	hover: { scale: 1.02 },
};

const overlayVariants = {
	initial: { opacity: 0.7 },
	hover: { opacity: 1 },
};

const contentVariants = {
	initial: { y: 5, opacity: 0.9 },
	hover: { y: 0, opacity: 1 },
};

const tagVariants = {
	initial: { opacity: 0.8, scale: 0.95 },
	hover: { opacity: 1, scale: 1 },
};

export default function GameCard({ game, size = 'normal' }: GameCardProps) {
	const { isHovered, handleMouseEnter, handleMouseLeave } = useHover();
	const cardRef = useRef<HTMLDivElement>(null);
	const isMobileOrTablet = useMediaQuery('(max-width: 1023px)');

	// Map size to height class for consistency across the app
	const getHeightClass = () => {
		switch (size) {
			case 'small':
				return 'h-[150px] sm:h-[200px] md:h-[230px] lg:h-[250px]';
			case 'large':
				return 'h-[280px] sm:h-[300px] md:h-[320px] lg:h-[350px]';
			default:
				return 'h-[200px] sm:h-[240px] md:h-[270px] lg:h-[300px]';
		}
	};

	const heightClass = getHeightClass();

	// Format sample tags based on available data
	const tags = game.genres?.map((genre) => genre.name).slice(0, 3) || [
		'Action',
		'Adventure',
	];

	return (
		<motion.div
			ref={cardRef}
			className="relative flex flex-col w-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
			style={{ transformOrigin: 'center center' }}
			variants={cardVariants}
			initial="initial"
			animate={isHovered ? 'hover' : 'initial'}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<Link href={`/games/${game.id}`} className="flex flex-col h-full">
				{/* Card content */}
				<div
					className={`relative rounded-lg overflow-hidden ${heightClass} w-full`}
				>
					{/* Game image */}
					<CardImage
						game={{
							id: game.id,
							name: game.name,
							image: game.background_image,
							background_image: game.background_image,
							rating: game.rating,
						}}
						isHovered={isHovered}
					/>

					{/* Rating badge - Always visible on all devices */}
					{game.rating && (
						<motion.div
							className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 md:top-3 md:right-3 bg-amber-500 text-white text-[10px] sm:text-[11px] md:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-2xl shadow-md z-20"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							★ {game.rating.toFixed(1)}
						</motion.div>
					)}

					{/* Overlay gradient and content */}
					<motion.div
						className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"
						variants={overlayVariants}
						initial="initial"
						animate={isHovered ? 'hover' : 'initial'}
					>
						<motion.div
							className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 md:p-4 z-20"
							variants={contentVariants}
						>
							{/* Game title - Always visible */}
							<h3 className="font-semibold text-white text-base sm:text-lg leading-tight mb-1 sm:mb-1.5 md:mb-2 line-clamp-1 drop-shadow-md">
								{game.name}
							</h3>

							{/* Game tags with responsive sizing and spacing */}
							<div className="flex flex-wrap gap-1 sm:gap-1.5 mb-1 sm:mb-1.5 md:mb-2">
								{tags.map((tag, i) => (
									<motion.span
										key={i}
										custom={i}
										variants={tagVariants}
										className="text-[10px] sm:text-xs bg-blue-500/80 text-white px-1.5 sm:px-2 py-0.5 rounded-2xl backdrop-blur-sm shadow-sm"
									>
										{tag}
									</motion.span>
								))}
							</div>

							{/* Game description - Visible on mobile/tablet always, desktop only on hover */}
							<motion.p
								className="text-[10px] sm:text-xs text-gray-200 line-clamp-2 mb-1 sm:mb-1.5 md:mb-2 drop-shadow"
								initial={{ opacity: isMobileOrTablet ? 1 : 0 }}
								animate={{ opacity: isMobileOrTablet || isHovered ? 1 : 0 }}
								transition={{ duration: 0.3 }}
							>
								{game.description ||
									'Experience this exciting game adventure with immersive gameplay.'}
							</motion.p>

							{/* View details text - Visible on mobile/tablet always, desktop only on hover */}
							<motion.div
								className="text-blue-400 text-[10px] sm:text-xs font-medium mt-0.5 sm:mt-1 drop-shadow-md"
								initial={{ opacity: isMobileOrTablet ? 1 : 0 }}
								animate={{ opacity: isMobileOrTablet || isHovered ? 1 : 0 }}
								transition={{ duration: 0.3 }}
							>
								View Details →
							</motion.div>
						</motion.div>
					</motion.div>
				</div>
			</Link>
		</motion.div>
	);
}
