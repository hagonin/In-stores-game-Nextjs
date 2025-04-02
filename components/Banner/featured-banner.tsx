'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AlertCircle } from 'lucide-react';
import { motion, MotionConfig, PanInfo } from 'framer-motion';

// Custom hooks
import { useFeaturedBanners } from '@/hooks/use-featured-banners';
import { useImageLoading } from '@/hooks/use-image-loading';

// Components
import BannerContent from './banner-content';
import BannerNavigation from './banner-navigation';
import BannerImage from './banner-image';
import BannerLoading from './banner-loading';

export default function FeaturedBanner() {
	const router = useRouter();
	const { banners, isLoading, shouldShowLoading } = useFeaturedBanners();
	const {
		isImageLoaded,
		isImageError,
		resetImageState,
		handleImageLoad,
		handleImageError,
	} = useImageLoading();

	// Custom state management for infinite carousel
	const [currentIndex, setCurrentIndex] = useState(0);

	// Generate an array with duplicate slides for the infinite effect
	const getCircularBanners = useCallback(() => {
		if (!banners || banners.length <= 1) return banners;

		// Create copies to enable infinite scrolling illusion
		return [...banners, ...banners, ...banners];
	}, [banners]);

	const circularBanners = getCircularBanners();
	const totalBanners = banners?.length || 0;

	// Calculate the starting index for the center set of banners
	const startingIndex = totalBanners;

	// Use this to track if we're currently performing a layout transition
	const [isLayoutAnimating, setIsLayoutAnimating] = useState(false);

	// Calculate the real index (for UI display)
	const realIndex = totalBanners
		? (((currentIndex - startingIndex) % totalBanners) + totalBanners) %
		  totalBanners
		: 0;

	// Client-side detection for device type
	const isDesktopQuery = useMediaQuery('(min-width: 1025px)');
	const isTabletQuery = useMediaQuery(
		'(min-width: 641px) and (max-width: 1024px)'
	);
	const isMobileQuery = useMediaQuery('(max-width: 640px)');

	// Default to mobile-first approach
	const [isDesktop, setIsDesktop] = useState(false);
	const [isTablet, setIsTablet] = useState(false);
	const [isMobile, setIsMobile] = useState(true);

	// Update states after hydration
	useEffect(() => {
		setIsDesktop(isDesktopQuery);
		setIsTablet(isTabletQuery);
		setIsMobile(isMobileQuery);
	}, [isDesktopQuery, isTabletQuery, isMobileQuery]);

	// After banners load, set the current index to the middle set
	useEffect(() => {
		if (banners && banners.length > 0) {
			setCurrentIndex(startingIndex);
		}
	}, [banners, startingIndex]);

	// Initialize the index if it changes drastically
	useEffect(() => {
		// If we've scrolled too far in either direction, reset to middle seamlessly
		if (currentIndex < totalBanners / 2) {
			setIsLayoutAnimating(true);
			setTimeout(() => {
				setCurrentIndex(startingIndex + (currentIndex % totalBanners));
				setIsLayoutAnimating(false);
			}, 50);
		} else if (
			currentIndex >=
			startingIndex + totalBanners + totalBanners / 2
		) {
			setIsLayoutAnimating(true);
			setTimeout(() => {
				setCurrentIndex(startingIndex + (currentIndex % totalBanners));
				setIsLayoutAnimating(false);
			}, 50);
		}
	}, [currentIndex, startingIndex, totalBanners]);

	// Add state for hover effect - only for desktop
	const [isHovered, setIsHovered] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	// Refs for the carousel
	const bannerRef = useRef<HTMLDivElement>(null);
	const constraintsRef = useRef<HTMLDivElement>(null);

	// Define banner height class based on screen size
	const getBannerHeight = () => {
		if (isMobile) return 'h-[350px]';
		if (isTablet) return 'h-[400px]';
		return 'h-[500px]';
	};

	const handleNavigate = (direction: 'next' | 'prev') => {
		resetImageState();

		if (direction === 'next') {
			setCurrentIndex((prevIndex) => prevIndex + 1);
		} else {
			setCurrentIndex((prevIndex) => prevIndex - 1);
		}
	};

	const handleGoToBanner = (index: number) => {
		resetImageState();
		// Convert dot index to the circular index
		setCurrentIndex(startingIndex + index);
	};

	const handleClickBanner = () => {
		// Don't navigate if dragging
		if (isDragging) return;

		const banner = banners[realIndex];
		if (banner?.id) {
			try {
				router.push(`/games/${banner.id}`);
			} catch (error) {
				console.error(`Failed to navigate to game: ${banner.id}`, error);
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

	// Handle drag events
	const handleDragStart = () => {
		setIsDragging(true);
	};

	const handleDragEnd = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		setIsDragging(false);

		const draggedDistance = info.offset.x;
		const swipeThreshold = 50;

		if (draggedDistance > swipeThreshold) {
			// Swiped right - go to previous
			setCurrentIndex((prevIndex) => prevIndex - 1);
		} else if (draggedDistance < -swipeThreshold) {
			// Swiped left - go to next
			setCurrentIndex((prevIndex) => prevIndex + 1);
		}
	};

	const bannerHeightClass = getBannerHeight();

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
								width: `${circularBanners.length * 100}%`, // Width based on total number of slides
								height: '100%',
							}}
							animate={{
								x: `-${currentIndex * (100 / circularBanners.length)}%`, // Position based on current index
							}}
							transition={{
								duration: isLayoutAnimating ? 0 : 0.5,
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
									key={`${banner.id}-${index}`}
									className="relative h-full"
									style={{ width: `${100 / circularBanners.length}%` }}
									onClick={handleClickBanner}
								>
									<BannerImage
										src={banner.image}
										mobileSrc={banner.mobileImage}
										alt={banner.title}
										isFirstBanner={index === startingIndex} // First banner in the middle set
										isImageLoaded={true} // Always render for smooth dragging
										isImageError={isImageError && index === currentIndex}
										onLoad={index === currentIndex ? handleImageLoad : () => {}}
										onError={
											index === currentIndex ? handleImageError : () => {}
										}
										onClick={handleClickBanner}
									/>

									<div className="absolute inset-0 flex flex-col justify-end">
										<div className="banner-content">
											{index === currentIndex && (
												<BannerContent
													title={banner.title}
													genres={banner.genres}
													isImageLoaded={
														isImageLoaded || index !== currentIndex
													}
													isHovered={isHovered || !isDesktop}
												/>
											)}
										</div>
									</div>
								</div>
							))}
						</motion.div>
					</div>

					{/* Navigation buttons and dots - use real index for navigation display */}
					<BannerNavigation
						totalBanners={totalBanners}
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
