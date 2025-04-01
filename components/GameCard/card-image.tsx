import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { ImageError } from '@/components/UI/image-error';
import type { GameById } from '@/lib/types';

interface CardImageProps {
	game: GameById;
	isHovered: boolean;
}

// Image animation variants
const imageVariants: Variants = {
	initial: {
		scale: 1,
		filter: 'brightness(1)',
		transition: {
			duration: 0.5,
			ease: [0.25, 1, 0.5, 1],
		},
	},
	hover: {
		scale: 1.15,
		filter: 'brightness(0.7)',
		transition: {
			duration: 0.5,
			ease: [0.25, 1, 0.5, 1],
		},
	},
};

export function CardImage({ game, isHovered }: CardImageProps) {
	const [isImageError, setIsImageError] = useState(false);

	if (isImageError) {
		return <ImageError />;
	}

	const imageSrc = game.image || game.background_image || '/placeholder.svg';
	const imageAlt = game.title || game.name || 'Game';

	return (
		<motion.div className="absolute inset-0 w-full h-full">
			<motion.div
				className="w-full h-full"
				variants={imageVariants}
				animate={isHovered ? 'hover' : 'initial'}
			>
				<Image
					src={imageSrc}
					alt={imageAlt}
					fill={true}
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					priority={false}
					className="object-cover"
					onError={() => setIsImageError(true)}
					loading="lazy"
				/>
			</motion.div>
		</motion.div>
	);
}
