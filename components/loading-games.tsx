import { useMediaQuery } from '@/hooks/use-media-query';
import { Skeleton } from '@/components/UI/skeleton';

interface LoadingGamesProps {
	count?: number;
}

export function LoadingGames({ count = 3 }: LoadingGamesProps) {
	const isMobile = useMediaQuery('(max-width: 640px)');
	const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

	// Get card height class - matching exact same sizes as GameCard component
	const getCardHeightClass = () => {
		return 'h-[250px] sm:h-[275px] md:h-[300px]';
	};

	return (
		<div className="animate-pulse mt-5">
			<div
				className={`grid grid-cols-1 gap-5 ${
					isMobile ? '' : isTablet ? 'md:grid-cols-2' : 'md:grid-cols-3'
				}`}
			>
				{Array.from({ length: count }).map((_, i) => (
					<div key={i} className="flex justify-center">
						{/* This div structure exactly matches the GameCard component */}
						<div className="relative flex flex-col w-full rounded-lg overflow-hidden">
							<div
								className={`relative rounded-lg overflow-hidden ${getCardHeightClass()}`}
							>
								{/* Main card skeleton */}
								<Skeleton className="w-full h-full rounded-lg" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
