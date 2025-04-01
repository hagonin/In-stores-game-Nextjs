import GameGrid from '@/components/Games/game-grid';
import { GameGridSkeleton } from '@/components/Games/game-grid-skeleton';
import { LoadingIndicator } from '@/components/UI/loading-indicator';
import { ScrollInfinite } from '@/components/scroll-infinite';
import { EndOfContent } from '@/components/end-of-content-game';
import { FilterBar } from '@/components/filter-bar';
import { LoadingGames } from '@/components/loading-games';
import { useGames } from '@/hooks/use-games';
import { ErrorMessage } from './UI/error-message';
import { Game } from '@/lib/types';
import { useEffect } from 'react';

interface GameSectionProps {
	onScrollToTop: () => void;
}

export function GameSection({ onScrollToTop }: GameSectionProps) {
	const {
		allGames,
		loading,
		initialLoading,
		shouldShowLoading,
		error,
		isEndOfContent,
		visibleItems,
		loadMoreGames,
		page,
		resetGames,
	} = useGames();

	// Log component data for debugging
	useEffect(() => {
		console.log(
			`GameSection: Render - page=${page}, games=${allGames.length}, loading=${loading}, isEndOfContent=${isEndOfContent}`
		);
	}, [page, allGames.length, loading, isEndOfContent]);

	return (
		<div className="relative">
			<h2 className="text-2xl font-bold text-center mb-6">
				Explore High-Rating Games
			</h2>
			{/* Static Filter Bar */}
			<FilterBar />

			{/* Game Grid with States */}
			<GameGridDisplay
				error={error}
				initialLoading={initialLoading}
				allGames={allGames}
				visibleItems={visibleItems}
				loading={loading}
				shouldShowLoading={shouldShowLoading}
				onRetry={() => resetGames()}
			/>

			{/* Infinite Scroll Component */}
			<ScrollInfinite
				onLoadMore={loadMoreGames}
				loading={loading && !initialLoading}
				hasMore={!isEndOfContent}
				loadingComponent={
					<div className="flex flex-col items-center">
						<LoadingIndicator />
						<p className="text-gray-600 font-medium">Loading more games...</p>
					</div>
				}
			/>

			{/* Show End of Content message when applicable */}
			{isEndOfContent && !loading && (
				<EndOfContent onScrollToTop={onScrollToTop} />
			)}
		</div>
	);
}

interface GameGridDisplayProps {
	error: string | null;
	initialLoading: boolean;
	allGames: Game[];
	visibleItems: Record<string, boolean>;
	loading: boolean;
	shouldShowLoading: boolean;
	onRetry: () => void;
}

// Internal component to handle display logic
function GameGridDisplay({
	error,
	initialLoading,
	allGames,
	visibleItems,
	loading,
	shouldShowLoading,
	onRetry,
}: GameGridDisplayProps) {
	if (error) {
		return <ErrorMessage message={error} onRetry={onRetry} />;
	}

	if (initialLoading) {
		return (
			<div className="pb-4">
				<GameGridSkeleton />
			</div>
		);
	}

	if (allGames && allGames.length > 0) {
		return (
			<div className="pb-4">
				<GameGrid games={allGames} visibleItems={visibleItems} />

				{/* Show skeleton at the bottom during pagination loading */}
				{loading && !shouldShowLoading && <LoadingGames count={3} />}
			</div>
		);
	}

	return (
		<div className="py-20 text-center">
			<p className="text-gray-500 mb-4">
				No games found. Please try again later.
			</p>
			<button
				className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
				onClick={onRetry}
			>
				Try Again
			</button>
		</div>
	);
}
