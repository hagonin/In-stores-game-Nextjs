'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AlertCircle } from 'lucide-react';
import { motion, MotionConfig, PanInfo } from 'framer-motion';
import { v4 as uuid } from 'uuid';

// Custom hooks
import { useFeaturedBanners } from '@/hooks/use-featured-banners';
import { useImageLoading } from '@/hooks/use-image-loading';

// Components
import BannerContent from './banner-content';
import BannerNavigation from './banner-navigation';
import BannerImage from './banner-image';
import BannerLoading from './banner-loading';

// Constants
const SWIPE_THRESHOLD = 50;
const RESET_TIMEOUT = 50;

// Extended Banner type to include uniqueKey for React keys
interface EnhancedBanner {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	mobileImage: string;
	genres?: string;
	uniqueKey: string;
}

export default function Banner() {
	const router = useRouter();
	const { banners, isLoading, shouldShowLoading } = useFeaturedBanners();
	const { isImageError, handleImageLoad, handleImageError } = useImageLoading();

	// Client-side detection for device type with initial values
	const isDesktopQuery = useMediaQuery('(min-width: 1025px)');
	const isTabletQuery = useMediaQuery(
		'(min-width: 641px) and (max-width: 1024px)'
	);
	const isMobileQuery = useMediaQuery('(max-width: 640px)');

	// Default to mobile-first approach with state
	const [isDesktop, setIsDesktop] = useState(false);
	const [isTablet, setIsTablet] = useState(false);
	const [isMobile, setIsMobile] = useState(true);

	// Update states after hydration
	useEffect(() => {
		setIsDesktop(isDesktopQuery);
		setIsTablet(isTabletQuery);
		setIsMobile(isMobileQuery);
	}, [isDesktopQuery, isTabletQuery, isMobileQuery]);

	// Carousel state
	const [isDragging, setIsDragging] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [currentVirtualIndex, setCurrentVirtualIndex] = useState(0);
	const bannerRef = useRef<HTMLDivElement>(null);
	const constraintsRef = useRef<HTMLDivElement>(null);

	const totalRealBanners = banners?.length || 0;
	const hasMultipleBanners = totalRealBanners > 1;

	// Create circular banners with unique keys
	const circularBanners = useMemo<EnhancedBanner[]>(() => {
		if (!hasMultipleBanners)
			return (banners ?? []).map((banner) => ({
				...banner,
				uniqueKey: `${banner.id}-${uuid()}`,
			}));

		// Create duplicates for infinite scrolling with unique keys
		return [...banners, ...banners, ...banners].map((banner) => ({
			...banner,
			uniqueKey: `${banner.id}-${uuid()}`,
		}));
	}, [banners, hasMultipleBanners]);

	// Calculate real index (accounting for the circular array)
	const realIndex = useMemo(() => {
		if (!hasMultipleBanners) return 0;

		// We need to map the current virtual index back to a real banner index
		// Add totalRealBanners and use modulo to ensure positive result
		return (
			((currentVirtualIndex % totalRealBanners) + totalRealBanners) %
			totalRealBanners
		);
	}, [currentVirtualIndex, totalRealBanners, hasMultipleBanners]);

	// Center set starting index
	const centerStartIndex = totalRealBanners;

	// Initialize to center set of banners
	useEffect(() => {
		if (banners && banners.length > 0) {
			setCurrentVirtualIndex(centerStartIndex);
		}
	}, [banners, centerStartIndex]);

	// Reset position when scrolling too far in either direction
	useEffect(() => {
		if (!hasMultipleBanners) return;

		if (currentVirtualIndex < totalRealBanners / 2) {
			const timer = setTimeout(() => {
				// Reset to middle set
				setCurrentVirtualIndex(
					centerStartIndex + (currentVirtualIndex % totalRealBanners)
				);
			}, RESET_TIMEOUT);
			return () => clearTimeout(timer);
		}

		if (
			currentVirtualIndex >=
			centerStartIndex + totalRealBanners + totalRealBanners / 2
		) {
			const timer = setTimeout(() => {
				// Reset to middle set
				setCurrentVirtualIndex(
					centerStartIndex + (currentVirtualIndex % totalRealBanners)
				);
			}, RESET_TIMEOUT);
			return () => clearTimeout(timer);
		}
	}, [
		currentVirtualIndex,
		centerStartIndex,
		totalRealBanners,
		hasMultipleBanners,
	]);

	// Define banner height class based on screen size
	const getBannerHeight = () => {
		if (isMobile) return 'h-[350px]';
		if (isTablet) return 'h-[400px]';
		return 'h-[500px]';
	};

	const bannerHeightClass = getBannerHeight();

	// Navigation handlers
	const handleNavigate = (direction: 'next' | 'prev') => {
		if (direction === 'next') {
			setCurrentVirtualIndex((prev) => prev + 1);
		} else {
			setCurrentVirtualIndex((prev) => prev - 1);
		}
	};

	const handleGoToBanner = (index: number) => {
		// Convert dot index to the circular index
		setCurrentVirtualIndex(centerStartIndex + index);
	};

	// Handle click on banner
	const handleClickBanner = () => {
		// Don't navigate if dragging
		if (isDragging) return;

		const gameId = banners[realIndex]?.id;
		if (gameId) {
			try {
				router.push(`/games/${gameId}`);
			} catch (error) {
				console.error(`Failed to navigate to game: ${gameId}`, error);
				router.push('/404');
			}
		}
	};

	// Handle hover events (desktop only)
	const handleMouseEnter = () => {
		if (isDesktop) {
			setIsHovered(true);
		}
	};

	const handleMouseLeave = () => {
		if (isDesktop) {
			setIsHovered(false);
		}
	};

	// Drag handlers
	const handleDragStart = () => {
		setIsDragging(true);
	};

	const handleDragEnd = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		setIsDragging(false);

		const draggedDistance = info.offset.x;

		if (draggedDistance > SWIPE_THRESHOLD) {
			// Swiped right - go to previous
			setCurrentVirtualIndex((prev) => prev - 1);
		} else if (draggedDistance < -SWIPE_THRESHOLD) {
			// Swiped left - go to next
			setCurrentVirtualIndex((prev) => prev + 1);
		}
	};

	if (isLoading) {
		return (
			<BannerLoading
				height={bannerHeightClass}
				showLoadingIndicator={shouldShowLoading}
			/>
		);
	}

	if (!banners || banners.length === 0) {
		return (
			<div className="relative bg-transparent">
				<div
					className={`min-w-7xl mx-auto relative overflow-hidden ${bannerHeightClass}`}
				>
					<div className="absolute inset-0 bg-neutral-100/50 backdrop-blur-sm flex flex-col items-center justify-center">
						<AlertCircle size={48} className="text-gray-400 mb-4" />
						<p className="text-gray-500">Unable to load the content</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<MotionConfig transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}>
			<div className="relative bg-transparent">
				<div
					ref={bannerRef}
					className={`w-full mx-auto relative overflow-hidden ${bannerHeightClass}`}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					{/* Parent container with ref for drag constraints */}
					<div
						ref={constraintsRef}
						className="relative w-full h-full overflow-hidden touch-pan-y"
					>
						{/* Draggable container */}
						<motion.div
							style={{
								width: `${circularBanners.length * 100}%`, // Width based on total slides count
								height: '100%',
							}}
							animate={{
								x: `-${currentVirtualIndex * (100 / circularBanners.length)}%`, // Position based on index
							}}
							transition={{
								duration: 0.5,
								ease: [0.32, 0.72, 0, 1],
							}}
							drag="x"
							dragElastic={0.1}
							dragConstraints={constraintsRef}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
							className="flex h-full cursor-grab active:cursor-grabbing"
						>
							{/* Map through banners including duplicates for infinite effect */}
							{circularBanners.map((banner, index) => (
								<div
									key={banner.uniqueKey}
									className="relative h-full"
									style={{ width: `${100 / circularBanners.length}%` }}
									onClick={handleClickBanner}
								>
									<BannerImage
										src={banner.image}
										mobileSrc={banner.mobileImage}
										alt={banner.title}
										isFirstBanner={index === centerStartIndex} // First banner in the middle set
										isImageLoaded={true} // Always render for smooth dragging
										isImageError={isImageError && index === currentVirtualIndex}
										onLoad={
											index === currentVirtualIndex ? handleImageLoad : () => {}
										}
										onError={
											index === currentVirtualIndex
												? handleImageError
												: () => {}
										}
										onClick={handleClickBanner}
									/>

									{/* Content container - always render but control visibility with opacity */}
									<div className="absolute inset-0 flex flex-col justify-end">
										<div
											className={`banner-content transition-opacity duration-300 ${
												index === currentVirtualIndex
													? 'opacity-100'
													: 'opacity-0'
											}`}
										>
											<BannerContent
												title={banner.title}
												genres={banner.genres}
												isHovered={isHovered || !isDesktop}
											/>
										</div>
									</div>
								</div>
							))}
						</motion.div>
					</div>

					{/* Navigation buttons and dots - use real index for navigation */}
					<BannerNavigation
						totalBanners={totalRealBanners}
						currentBanner={realIndex}
						onNext={() => handleNavigate('next')}
						onPrev={() => handleNavigate('prev')}
						onGoTo={handleGoToBanner}
					/>
				</div>
			</div>
		</MotionConfig>
	);
}
