import { useState, useEffect, useCallback } from 'react';
import { Game } from '@/lib/types';
import { gameService } from '@/lib/api-service';

export function useGames() {
	const [allGames, setAllGames] = useState<Game[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [shouldShowLoading, setShouldShowLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isEndOfContent, setIsEndOfContent] = useState(false);
	const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});

	// Declare fetchInitialGames first as a function reference
	let fetchInitialGames = useCallback(async () => {}, []);

	// Reset function for error states or manual refresh
	const resetGames = useCallback(() => {
		setAllGames([]);
		setPage(1);
		setError(null);
		setIsEndOfContent(false);
		setVisibleItems({});
		setInitialLoading(true);
		setShouldShowLoading(false);

		// Small delay before refetching to ensure states are reset
		setTimeout(() => {
			fetchInitialGames();
		}, 100);
	}, [fetchInitialGames]);

	// Now assign the actual implementation to fetchInitialGames
	fetchInitialGames = useCallback(async () => {
		// Prevent duplicate requests
		if (loading) {
			console.log('useGames: Already loading, skipping fetchInitialGames');
			return;
		}

		setLoading(true);
		setInitialLoading(true);
		setShouldShowLoading(true);
		setError(null);

		try {
			console.log('useGames: Fetching initial games');
			const games = await gameService.getGames();

			if (!games || games.length === 0) {
				setError('No games found. Please try again later.');
				setIsEndOfContent(true);
				return;
			}

			console.log(`useGames: Fetched ${games.length} initial games`);
			setAllGames(games);
			setVisibleItems(
				games.reduce(
					(acc, game) => ({
						...acc,
						[game.id]: true,
					}),
					{}
				)
			);

			// Reset page to 1 since we've loaded the first page
			setPage(1);
		} catch (err) {
			console.error('useGames: Failed to load initial games:', err);
			setError('Failed to load games. Please try again later.');
		} finally {
			setLoading(false);
			setInitialLoading(false);
			setShouldShowLoading(false);
		}
	}, [loading]);

	// Function to load more games - memoized to prevent unnecessary re-renders
	const loadMoreGames = useCallback(async () => {
		if (loading || isEndOfContent) {
			console.log(
				`useGames: Skipping loadMoreGames - ${
					loading ? 'already loading' : 'end of content reached'
				}`
			);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// Try up to 3 pages if needed
			let uniqueNewGames: Game[] = [];
			let currentPage = page;
			let attemptCount = 0;
			const MAX_ATTEMPTS = 3;

			while (uniqueNewGames.length === 0 && attemptCount < MAX_ATTEMPTS) {
				const nextPage = currentPage + 1;
				attemptCount++;

				console.log(
					`useGames: Loading games for page ${nextPage} (attempt ${attemptCount}/${MAX_ATTEMPTS})`
				);

				const newGames = await gameService.getGamesByPage(nextPage);

				// If we got no games, we've reached the end
				if (!newGames || newGames.length === 0) {
					console.log('useGames: No more games available');
					setIsEndOfContent(true);
					break;
				}

				console.log(
					`useGames: Received ${newGames.length} games for page ${nextPage}`
				);

				// Filter out any duplicates (by ID)
				uniqueNewGames = newGames.filter(
					(newGame) =>
						!allGames.some((existingGame) => existingGame.id === newGame.id)
				);

				console.log(
					`useGames: ${uniqueNewGames.length} unique games after filtering`
				);

				// If we have unique games, we're done
				if (uniqueNewGames.length > 0) {
					setPage(nextPage);
					break;
				}

				// If all games were duplicates, try the next page
				console.log(`useGames: All games were duplicates, trying next page`);
				currentPage = nextPage;
			}

			// Process the unique games or handle end of content
			if (uniqueNewGames.length > 0) {
				// Add the new games to our collection
				setAllGames((current) => [...current, ...uniqueNewGames]);

				// Set all new games as visible
				setVisibleItems((current) => {
					const newVisibility = { ...current };
					uniqueNewGames.forEach((game) => {
						newVisibility[game.id] = true;
					});
					return newVisibility;
				});
			} else if (attemptCount >= MAX_ATTEMPTS) {
				console.log(
					'useGames: Reached maximum attempts, end of content reached'
				);
				setIsEndOfContent(true);
			}
		} catch (err) {
			console.error('useGames: Error loading more games:', err);
			setError('Failed to load more games. Please try again later.');
		} finally {
			setLoading(false);
		}
	}, [loading, isEndOfContent, page, allGames]);

	// Initialize visibility state for initial games
	useEffect(() => {
		if (allGames.length > 0 && Object.keys(visibleItems).length === 0) {
			console.log('useGames: Initializing visibility state for games');
			const initialVisibility: Record<string, boolean> = {};

			allGames.forEach((game, index) => {
				setTimeout(() => {
					setVisibleItems((prev) => ({
						...prev,
						[game.id]: true,
					}));
				}, index * 100);

				initialVisibility[game.id] = false;
			});

			setVisibleItems(initialVisibility);
		}
	}, [allGames]);

	// Fetch initial games on component mount
	useEffect(() => {
		let isMounted = true;

		const loadInitialGames = async () => {
			try {
				// Small delay to prevent instant loading flash
				await new Promise((resolve) => setTimeout(resolve, 100));
				if (isMounted && initialLoading) {
					await fetchInitialGames();
				}
			} catch (error) {
				console.error('useGames: Failed to load initial games:', error);
				if (isMounted) {
					setError('Failed to load games. Please try again later.');
					setInitialLoading(false);
					setLoading(false);
				}
			}
		};

		loadInitialGames();

		return () => {
			isMounted = false;
		};
	}, [fetchInitialGames, initialLoading]);

	return {
		allGames,
		loading,
		initialLoading,
		shouldShowLoading,
		error,
		isEndOfContent,
		visibleItems,
		fetchInitialGames,
		loadMoreGames,
		resetGames,
		page,
	};
}
