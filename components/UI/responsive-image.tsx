import Image from 'next/image';
import { useState } from 'react';
import { ImageError } from './image-error';

interface ResponsiveImageProps {
	src: string;
	alt: string;
	className?: string;
	priority?: boolean;
	sizes?: string;
	fill?: boolean;
	width?: number;
	height?: number;
	objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
	aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2';
	onClick?: () => void;
	onError?: () => void;
	loading?: 'lazy' | 'eager';
	onLoad?: () => void;
}

export function ResponsiveImage({
	src,
	alt,
	className = '',
	priority = false,
	sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
	fill = false,
	width,
	height,
	objectFit = 'cover',
	aspectRatio,
	onClick,
	onError,
	onLoad,
	loading,
}: ResponsiveImageProps) {
	const [isError, setIsError] = useState(false);

	if (isError) {
		return <ImageError />;
	}

	const aspectRatioClass = aspectRatio
		? {
				'1:1': 'aspect-square',
				'16:9': 'aspect-video',
				'4:3': 'aspect-[4/3]',
				'3:2': 'aspect-[3/2]',
		  }[aspectRatio]
		: '';

	const containerClass = `relative ${
		fill ? 'w-full h-full' : ''
	} ${aspectRatioClass} overflow-hidden ${className}`;

	const handleImageLoad = () => {
		if (onLoad) onLoad();
	};

	const handleImageError = () => {
		setIsError(true);
		if (onError) onError();
	};

	return (
		<div className={containerClass} onClick={onClick}>
			<Image
				src={src}
				alt={alt}
				fill={fill}
				width={!fill ? width : undefined}
				height={!fill ? height : undefined}
				quality={80}
				priority={priority}
				className={`transition-all duration-300 ${
					objectFit === 'cover' ? 'object-cover' : `object-${objectFit}`
				} w-full h-full`}
				sizes={sizes}
				onError={handleImageError}
				onLoad={handleImageLoad}
				loading={loading || (priority ? 'eager' : 'lazy')}
			/>
		</div>
	);
}
