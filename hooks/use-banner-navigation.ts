import { useState} from 'react';

export function useBannerNavigation<T extends { id: string }>(banners: T[]) {
	const [currentBanner, setCurrentBanner] = useState(0);

	const nextBanner = () => {
		setCurrentBanner((prev) => (prev + 1) % banners.length);
	};

	const prevBanner = () => {
		setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
	};

	const goToBanner = (index: number) => {
		setCurrentBanner(index);
	};

	return {
		currentBanner,
		nextBanner,
		prevBanner,
		goToBanner,
	};
}
