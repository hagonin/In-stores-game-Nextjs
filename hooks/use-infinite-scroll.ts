import { useEffect } from 'react';

interface UseInfiniteScrollOptions {
	callback: () => void;
	loaderRef: React.RefObject<Element>;
	enabled?: boolean;
	rootMargin?: string;
}

/**
 * Custom hook to trigger a callback when the loaderRef element scrolls into view.
 */
export function useInfiniteScroll({
	callback,
	loaderRef,
	enabled = true,
	rootMargin = '600px 0px',
}: UseInfiniteScrollOptions) {
	useEffect(() => {
		if (!enabled || !loaderRef?.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					callback();
				}
			},
			{
				threshold: 0,
				rootMargin,
			}
		);

		const el = loaderRef.current;
		observer.observe(el);

		return () => {
			if (el) observer.unobserve(el);
		};
	}, [callback, loaderRef, enabled, rootMargin]);
}
