'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import type { Game, GameById } from '@/lib/types';
import { CardImage } from './card-image';
import { useHover } from '@/hooks/use-hover';
import {
	cardVariants,
	contentVariants,
	overlayVariants,
	tagVariants,
} from '@/lib/game-utils';

interface GameCardProps {
	game: Game;
	size?: 'normal' | 'large' | 'small';
}

export default function GameCard({ game, size = 'normal' }: GameCardProps) {
	const { isHovered, handleMouseEnter, handleMouseLeave } = useHover();
	const cardRef = useRef<HTMLDivElement>(null);

	// Map size to height class for consistency across the app
	const getHeightClass = () => {
		switch (size) {
			case 'small':
				return 'h-[160px] sm:h-[225px] md:h-[250px]';
			case 'large':
				return 'h-[320px] sm:h-[325px] md:h-[350px]';
			default:
				return 'h-[220px] sm:h-[275px] md:h-[300px]';
		}
	};

	// Convert Game to GameById format
	const gameData: GameById = {
		id: game.id,
		name: game.name,
		image: game.background_image,
		background_image: game.background_image,
		description: game.description,
		rating: game.rating,
		stores: game.stores ? [game.stores.name] : [],
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
			className="relative flex flex-col w-full rounded-lg overflow-hidden"
			style={{ transformOrigin: 'center center' }}
			variants={cardVariants}
			initial="initial"
			animate={isHovered ? 'hover' : 'initial'}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<Link href={`/games/${game.id}`} className="flex flex-col">
				{/* Card content */}
				<div className={`relative rounded-lg overflow-hidden ${heightClass}`}>
					{/* Game image */}
					<CardImage game={gameData} isHovered={isHovered} />
					{game.rating && (
						<motion.div
							className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-20"
							initial={{ opacity: 0, y: -10 }}
							animate={
								isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }
							}
							transition={{ duration: 0.3, delay: 0.1 }}
						>
							★ {game.rating.toFixed(1)}
						</motion.div>
					)}
					{/* Overlay gradient and content */}
					<motion.div
						className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"
						variants={overlayVariants}
						initial="initial"
						animate={isHovered ? 'hover' : 'initial'}
					>
						<motion.div
							className="absolute bottom-0 left-0 right-0 p-4 z-20"
							variants={contentVariants}
						>
							{/* Game title */}
							<h3 className="font-semibold text-white text-lg leading-tight mb-2 line-clamp-1">
								{game.name}
							</h3>

							{/* Game tags */}
							<div className="flex flex-wrap gap-1.5 mb-2">
								{tags.map((tag, i) => (
									<motion.span
										key={i}
										custom={i}
										variants={tagVariants}
										className="text-xs bg-blue-500/80 text-white/90 px-2 py-0.5 rounded-2xl backdrop-blur-sm"
									>
										{tag}
									</motion.span>
								))}
							</div>

							{/* Game description */}
							<motion.p
								className="text-xs text-gray-300 line-clamp-2 mb-2"
								initial={{ opacity: 0 }}
								animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
								transition={{ duration: 0.3, delay: 0.1 }}
							>
								{game.description ||
									'Experience this exciting game adventure with immersive gameplay.'}
							</motion.p>

							{/* View details text */}
							<motion.div
								className="text-blue-400 text-xs font-medium mt-1"
								initial={{ opacity: 0 }}
								animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
								transition={{ duration: 0.3, delay: 0.2 }}
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
