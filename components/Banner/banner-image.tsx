import { useState, useEffect } from 'react';
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
	onClick: () => void;
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
	onClick,
}: BannerImageProps) {
	const isMobile = useMediaQuery('(max-width: 767px)');
	const [imageSrc, setImageSrc] = useState(src);

	// Use mobile image on smaller screens if available
	useEffect(() => {
		if (isMobile && mobileSrc) {
			setImageSrc(mobileSrc);
		} else {
			setImageSrc(src);
		}
	}, [isMobile, mobileSrc, src]);

	if (isImageError) {
		return (
			<div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
				<p className="text-gray-500">Failed to load image</p>
			</div>
		);
	}

	return (
		<div className="relative w-full h-full" onClick={onClick}>
			<ResponsiveImage
				src={imageSrc}
				alt={alt}
				fill={true}
				priority={isFirstBanner}
				className={`transition-opacity duration-700 ${
					isImageLoaded ? 'opacity-100' : 'opacity-0'
				}`}
				sizes="100vw"
				onClick={onClick}
				onLoad={onLoad}
				onError={onError}
			/>
		</div>
	);
}
