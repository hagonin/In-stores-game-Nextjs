import { useState, useCallback } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

export const useHover = (onlyDesktop = true) => {
	const [isHovered, setIsHovered] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	const handleMouseEnter = useCallback(() => {
		if (!onlyDesktop || (onlyDesktop && isDesktop)) {
			setIsHovered(true);
		}
	}, [onlyDesktop, isDesktop]);

	const handleMouseLeave = useCallback(() => {
		if (!onlyDesktop || (onlyDesktop && isDesktop)) {
			setIsHovered(false);
		}
	}, [onlyDesktop, isDesktop]);

	return {
		isHovered,
		handleMouseEnter,
		handleMouseLeave,
	};
};
