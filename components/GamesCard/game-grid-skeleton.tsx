import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Skeleton } from '@/components/UI/skeleton';
import { getCardHeightClass, getGridRows } from '@/lib/utils';

export function GameGridSkeleton() {
	const isMobile = useMediaQuery('(max-width: 640px)');
	const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

	const rows = getGridRows(isMobile,isTablet);

	return (
		<div className="grid gap-5 sm:gap-4 md:gap-6 animate-pulse">
			{rows.map((cardsInRow, rowIndex) => {
				// Determine row types based on pattern position - matching the same logic as game-grid.tsx
				const patternPosition = rowIndex % 3;
				const isLargeRow = !isMobile && !isTablet && patternPosition === 2;
				const isSmallRow = !isMobile && !isTablet && patternPosition === 3;

				// Determine the card size for this row
				const cardSize = isLargeRow ? 'large' : isSmallRow ? 'small' : 'normal';

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
						{Array.from({ length: cardsInRow }).map((_, cardIndex) => (
							<div key={cardIndex} className="flex justify-center">
								{/* This div structure matches the GameCard component */}
								<div className="relative flex flex-col w-full rounded-lg overflow-hidden">
									<div
										className={`relative rounded-lg overflow-hidden ${getCardHeightClass(
											cardSize
										)}`}
									>
										{/* Main card skeleton */}
										<Skeleton className="w-full h-full rounded-lg" />
									</div>
								</div>
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
}
