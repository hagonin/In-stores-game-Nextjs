import { gameService } from './api-service';
import { Game, GameById } from './types';
import type { Variants } from 'framer-motion';

export async function fetchGames(): Promise<Game[]> {
	try {
		return await gameService.getGames();
	} catch (error) {
		return [];
	}
}

export async function fetchFeaturedGames(): Promise<Game[]> {
	try {
		return await gameService.getFeaturedGames();
	} catch (error) {
		return [];
	}
}

export async function fetchGameById(id: number): Promise<GameById | null> {
	try {
		return await gameService.getGameById(id);
	} catch (error) {
		return null;
	}
}

// Card container animation variants
export const cardVariants: Variants = {
	initial: {
		scale: 1,
		y: 0,
		boxShadow: '0px 0px 0px rgba(0,0,0,0)',
	},
	hover: {
		scale: 1.05,
		y: -4,
		boxShadow:
			'0px 10px 30px -5px rgba(0,0,0,0.3), 0px 8px 15px -6px rgba(0,0,0,0.2)',
		transition: {
			type: 'spring',
			stiffness: 400,
			damping: 25,
			mass: 1,
		},
	},
};

// Overlay animation variants
export const overlayVariants: Variants = {
	initial: {
		opacity: 0,
	},
	hover: {
		opacity: 1,
		transition: { duration: 0.3 },
	},
};

// Content animation variants
export const contentVariants: Variants = {
	initial: {
		opacity: 0,
		y: 10,
	},
	hover: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: [0.19, 1, 0.22, 1],
		},
	},
};

// Tag animation variants (for staggered animation)
export const tagVariants: Variants = {
	initial: {
		scale: 0.8,
		opacity: 0,
	},
	hover: (i) => ({
		scale: 1,
		opacity: 1,
		transition: {
			delay: i * 0.05,
			duration: 0.2,
		},
	}),
};
/**
 * Formats genres from a game object into a string
 */
export function formatGenres(game: Game): string {
	if (!game.genres || game.genres.length === 0) return '';

	const displayGenres = game.genres.slice(0, 3);
	return displayGenres.map((genre) => genre.name).join(' · ');
}

/**
 * Converts a basic Game object to the extended GameById format
 * Used for consistent data structure in components
 */
export function convertToGameById(game: Game): GameById {
	return {
		id: game.id,
		name: game.name,
		title: game.name,
		slug: game.slug,
		image: game.background_image,
		background_image: game.background_image,
		description: game.description,
		rating: game.rating,
	};
}
