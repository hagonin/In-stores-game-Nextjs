import { useState, useEffect, useRef } from 'react';

export function useBannerNavigation<T extends { id: string }>(banners: T[]) {
	const [currentBanner, setCurrentBanner] = useState(0);
	const [autoSlide, setAutoSlide] = useState(true);
	const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const nextBanner = () => {
		setCurrentBanner((prev) => (prev + 1) % banners.length);
	};

	const prevBanner = () => {
		setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
	};

	const goToBanner = (index: number) => {
		setCurrentBanner(index);
	};

	const pauseAutoSlide = () => {
		setAutoSlide(false);
	};

	const resumeAutoSlide = () => {
		setAutoSlide(true);
	};

	// Set up auto-slide functionality
	useEffect(() => {
		// Don't set up interval if there are no banners or autoSlide is disabled
		if (banners.length <= 1 || !autoSlide) {
			if (autoSlideIntervalRef.current) {
				clearInterval(autoSlideIntervalRef.current);
				autoSlideIntervalRef.current = null;
			}
			return;
		}

		// Set up interval to change banner every 5 seconds
		autoSlideIntervalRef.current = setInterval(() => {
			nextBanner();
		}, 5000);

		// Clean up interval on unmount or when dependencies change
		return () => {
			if (autoSlideIntervalRef.current) {
				clearInterval(autoSlideIntervalRef.current);
				autoSlideIntervalRef.current = null;
			}
		};
	}, [banners.length, autoSlide]);

	return {
		currentBanner,
		nextBanner,
		prevBanner,
		goToBanner,
		pauseAutoSlide,
		resumeAutoSlide,
	};
}
