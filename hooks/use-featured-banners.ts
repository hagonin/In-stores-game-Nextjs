import { useState, useEffect, useCallback } from 'react';
import { fetchFeaturedGames } from '@/lib/game-utils';
import { Game } from '@/lib/types';
import { formatGenres } from '@/lib/game-utils';

// Banner interface
export interface Banner {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	mobileImage: string;
	genres?: string;
}

export function useFeaturedBanners() {
	const [banners, setBanners] = useState<Banner[]>([]);
	const [currentBanner, setCurrentBanner] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [loadStartTime, setLoadStartTime] = useState(0);
	const [shouldShowLoading, setShouldShowLoading] = useState(false);

	// Load banners data
	useEffect(() => {
		const loadBanners = async () => {
			setLoadStartTime(Date.now());
			setShouldShowLoading(false);

			try {
				const games = await fetchFeaturedGames();

				if (games.length > 0) {
					const formattedBanners = games.map((game) =>
						formatGameToBanner(game)
					);
					setBanners(formattedBanners);
				}
			} catch (error) {
				console.error('Error loading banners:', error);
			} finally {
				// Only show loading UI if it took more than 1 second
				const loadTime = Date.now() - loadStartTime;
				if (loadTime > 1000) {
					setShouldShowLoading(true);
				}

				// Delay hiding loading state if it was fast
				setTimeout(
					() => {
						setIsLoading(false);
					},
					loadTime > 1000 ? 0 : 500
				);
			}
		};

		loadBanners();
	}, []);

	// Format game data to banner format
	const formatGameToBanner = (game: Game): Banner => {
		// Use a high-quality screenshot if available, or the background image
		const mobileImage = game.background_image;
		const desktopImage =
			game.short_screenshots && game.short_screenshots.length > 1
				? game.short_screenshots[1].image
				: game.background_image;

		return {
			id: String(game.id),
			title: game.name,
			subtitle: game.description_raw
				? game.description_raw.slice(0, 100) + '...'
				: `Released: ${game.released || 'Unknown date'}`,
			image: desktopImage,
			mobileImage: mobileImage,
			genres: formatGenres(game),
		};
	};

	// Navigation functions
	const nextBanner = useCallback(() => {
		setCurrentBanner((prev) => (prev + 1) % banners.length);
	}, [banners.length]);

	const prevBanner = useCallback(() => {
		setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
	}, [banners.length]);

	const goToBanner = useCallback(
		(index: number) => {
			if (index >= 0 && index < banners.length) {
				setCurrentBanner(index);
			}
		},
		[banners.length]
	);

	return {
		banners,
		currentBanner,
		isLoading,
		shouldShowLoading,
		nextBanner,
		prevBanner,
		goToBanner,
	};
}
