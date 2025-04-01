'use client';

import { useState, useCallback } from 'react';

export function useImageLoading() {
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	const [isImageError, setIsImageError] = useState(false);

	const resetImageState = useCallback(() => {
		setIsImageLoaded(false);
		setIsImageError(false);
	}, []);

	const handleImageLoad = useCallback(() => {
		setIsImageLoaded(true);
	}, []);

	const handleImageError = useCallback(() => {
		setIsImageError(true);
	}, []);

	return {
		isImageLoaded,
		isImageError,
		resetImageState,
		handleImageLoad,
		handleImageError,
	};
}
