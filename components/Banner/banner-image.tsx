import { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ResponsiveImage } from '@/components/UI/responsive-image';

interface BannerImageProps {
	src: string;
	mobileSrc?: string;
	alt: string;
	isFirstBanner: boolean;
	isImageLoaded: boolean;
	isImageError: boolean;
	onLoad: () => void;
	onError: () => void;
}

export default function BannerImage({
	src,
	mobileSrc,
	alt,
	isFirstBanner,
	isImageLoaded,
	isImageError,
	onLoad,
	onError,
}: BannerImageProps) {
	const isMobileQuery = useMediaQuery('(max-width: 767px)');
	const [isMobile, setIsMobile] = useState(false);
	const [imageSrc, setImageSrc] = useState(src);
	const prevSrcRef = useRef(src);
	const prevMobileSrcRef = useRef(mobileSrc);

	// Update responsive state safely to prevent infinite loops
	useEffect(() => {
		setIsMobile(isMobileQuery);
	}, [isMobileQuery]);

	// Only update image source when necessary
	useEffect(() => {
		// Check if sources have changed
		if (src !== prevSrcRef.current || mobileSrc !== prevMobileSrcRef.current) {
			prevSrcRef.current = src;
			if (mobileSrc) prevMobileSrcRef.current = mobileSrc;
		}

		// Set the correct image source based on screen size
		const newSrc = isMobile && mobileSrc ? mobileSrc : src;
		if (newSrc !== imageSrc) {
			setImageSrc(newSrc);
		}
	}, [isMobile, mobileSrc, src, imageSrc]);

	if (isImageError) {
		return (
			<div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
				<p className="text-gray-500">Failed to load image</p>
			</div>
		);
	}

	return (
		<div className="relative w-full h-full">
			{/* Gradient overlay for better content visibility */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 pointer-events-none"></div>

			<ResponsiveImage
				src={imageSrc}
				alt={alt}
				fill={true}
				priority={isFirstBanner}
				className={`transition-opacity duration-700 ${
					isImageLoaded ? 'opacity-100' : 'opacity-0'
				}`}
				sizes="100vw"
				onLoad={onLoad}
				onError={onError}
			/>
		</div>
	);
}
