import type { Game } from '@/lib/types';
import GameCard from '@/components/GameCard/card-game';
import { useMediaQuery } from '@/hooks/use-media-query';
import { motion } from 'framer-motion';
import { groupGamesIntoRows } from './games-rows';
import { GameGridSkeleton } from './game-grid-skeleton';
import { useVisibleItems } from '@/hooks/use-visible-items';

interface GameGridProps {
	games: Game[];
	isLoading?: boolean;
	visibleItems?: Record<string, boolean>;
}

export default function GameGrid({
	games = [],
	isLoading = false,
	visibleItems: externalVisibleItems,
}: GameGridProps) {
	// Responsive breakpoints
	const isMobile = useMediaQuery('(max-width: 640px)');
	const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

	// Manage visibility for animation if no external visibleItems provided
	const { visibleItems: internalVisibleItems } = useVisibleItems(games, {
		initialDelay: 100,
		staggerDelay: 50,
	});

	// Use external or internal visibility state
	const visibleItems = externalVisibleItems || internalVisibleItems;

	// Show loading state if loading
	if (isLoading) {
		return <GameGridSkeleton />;
	}

	// Show empty state if no games
	if (!games || games.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500">No games available</p>
			</div>
		);
	}

	// Group games into rows based on screen size
	const rows = groupGamesIntoRows(games, isMobile, isTablet);

	return (
		<div className="grid gap-5">
			{rows.map((row, rowIndex) => {
				// Determine row types based on pattern position
				const patternPosition = rowIndex % 3;
				const isLargeRow = !isMobile && !isTablet && patternPosition === 2;
				const isSmallRow = !isMobile && !isTablet && patternPosition === 3;

				return (
					<div
						key={rowIndex}
						className={`grid grid-cols-1 gap-5 sm:gap-4 md:gap-6 ${
							isMobile
								? ''
								: isTablet
								? 'md:grid-cols-2'
								: isLargeRow
								? 'md:grid-cols-2'
								: patternPosition === 0 || patternPosition === 3
								? 'md:grid-cols-3'
								: 'md:grid-cols-4'
						}`}
					>
						{row.map((game) => (
							<motion.div
								key={game.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{
									opacity: visibleItems[game.id] ? 1 : 0,
									y: visibleItems[game.id] ? 0 : 20,
								}}
								transition={{ duration: 0.5, ease: 'easeOut' }}
								className="flex justify-center"
							>
								<GameCard
									key={game.id}
									game={game}
									size={isLargeRow ? 'large' : isSmallRow ? 'small' : 'normal'}
								/>
							</motion.div>
						))}
					</div>
				);
			})}
		</div>
	);
}
