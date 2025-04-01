import { useEffect, useRef, useCallback } from 'react';

interface ScrollInfiniteProps {
	onLoadMore: () => void;
	loading: boolean;
	hasMore: boolean;
	loadingComponent?: React.ReactNode;
}

export function ScrollInfinite({
	onLoadMore,
	loading,
	hasMore,
	loadingComponent,
}: ScrollInfiniteProps) {
	const loaderRef = useRef<HTMLDivElement>(null);

	// Memoize the loadMore function to prevent unnecessary re-renders
	const loadMore = useCallback(() => {
		if (!loading && hasMore) {
			console.log('ScrollInfinite: Triggered load more');
			onLoadMore();
		} else {
			console.log(
				`ScrollInfinite: Load more skipped (loading=${loading}, hasMore=${hasMore})`
			);
		}
	}, [loading, hasMore, onLoadMore]);

	// Set up the intersection observer
	useEffect(() => {
		const currentRef = loaderRef.current;

		if (!currentRef) {
			console.log('ScrollInfinite: No loader reference found');
			return;
		}

		// Create a new IntersectionObserver instance
		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;

				if (entry.isIntersecting) {
					console.log('ScrollInfinite: Element is intersecting viewport');
					if (hasMore && !loading) {
						loadMore();
					} else {
						console.log(
							`ScrollInfinite: Intersection detected but not loading more (hasMore=${hasMore}, loading=${loading})`
						);
					}
				}
			},
			{
				root: null, // Use the viewport as the root
				rootMargin: '200px 0px', // Start loading when within 200px of viewport
				threshold: 0.1, // Trigger when at least 10% is visible
			}
		);

		// Start observing our loader element
		observer.observe(currentRef);
		console.log('ScrollInfinite: Observer started on loader element');

		// Clean up observer on unmount
		return () => {
			if (currentRef) {
				console.log('ScrollInfinite: Cleaning up observer');
				observer.unobserve(currentRef);
			}
		};
	}, [hasMore, loading, loadMore]);

	return (
		<div
			ref={loaderRef}
			className="w-full h-24 flex items-center justify-center mt-4 mb-8"
			data-testid="infinite-scroll-trigger"
		>
			{loading && loadingComponent}
			{!loading && hasMore && (
				<div className="text-xs text-gray-400">Scroll for more games</div>
			)}
			{!hasMore && !loading && (
				<div className="text-sm text-gray-500 py-4">
					You&apos;ve seen all games
				</div>
			)}
		</div>
	);
}
