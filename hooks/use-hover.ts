import { useState, useCallback, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

export const useHover = () => {
	const [isHovered, setIsHovered] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 1024px)');
	const isMobileOrTablet = useMediaQuery('(max-width: 1023px)');

	// Force hover state to be true on mobile/tablet to ensure content visibility
	useEffect(() => {
		if (isMobileOrTablet) {
			setIsHovered(true);
		}
	}, [isMobileOrTablet]);

	const handleMouseEnter = useCallback(() => {
		// Only allow hover effect on desktop
		if (isDesktop) {
			setIsHovered(true);
		}
	}, [isDesktop]);

	const handleMouseLeave = useCallback(() => {
		// Only reset hover state on desktop
		if (isDesktop) {
			setIsHovered(false);
		}
	}, [isDesktop]);

	return {
		isHovered,
		handleMouseEnter,
		handleMouseLeave,
	};
};
