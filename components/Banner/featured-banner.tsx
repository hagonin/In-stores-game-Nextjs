'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AlertCircle } from 'lucide-react';

// Custom hooks
import { useFeaturedBanners } from '@/hooks/use-featured-banners';
import { useImageLoading } from '@/hooks/use-image-loading';
import { useBannerNavigation } from '@/hooks/use-banner-navigation';

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
	const {
		currentBanner,
		nextBanner,
		prevBanner,
		goToBanner,
		pauseAutoSlide,
		resumeAutoSlide,
	} = useBannerNavigation(banners);

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

	// Add state for hover effect - only for desktop
	const [isHovered, setIsHovered] = useState(false);
	const bannerRef = useRef<HTMLDivElement>(null);

	// Define banner height class based on screen size
	const getBannerHeight = () => {
		if (isMobile) return 'h-[350px]';
		if (isTablet) return 'h-[400px]';
		return 'h-[500px]';
	};

	const handleNavigate = (direction: 'next' | 'prev') => {
		resetImageState();
		if (direction === 'next') {
			nextBanner();
		} else {
			prevBanner();
		}
	};

	const handleGoToBanner = (index: number) => {
		resetImageState();
		goToBanner(index);
	};

	const handleClickBanner = () => {
		const gameId = banners[currentBanner]?.id;
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
			pauseAutoSlide(); // Pause auto-slide while hovering
		}
	};

	const handleMouseLeave = () => {
		if (isDesktop) {
			setIsHovered(false);
			resumeAutoSlide(); // Resume auto-slide when not hovering
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

	if (banners.length === 0) {
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
		<div className="relative bg-transparent">
			<div
				ref={bannerRef}
				className={`w-full mx-auto relative overflow-hidden ${bannerHeightClass}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div
					className="absolute inset-0 cursor-pointer"
					onClick={handleClickBanner}
				>
					<BannerImage
						src={banners[currentBanner].image}
						mobileSrc={banners[currentBanner].mobileImage}
						alt={banners[currentBanner].title}
						isFirstBanner={currentBanner === 0}
						isImageLoaded={isImageLoaded}
						isImageError={isImageError}
						onLoad={handleImageLoad}
						onError={handleImageError}
						onClick={handleClickBanner}
					/>

					<div className="absolute inset-0 flex flex-col justify-end">
						<div className="banner-content">
							<BannerContent
								title={banners[currentBanner].title}
								subtitle={banners[currentBanner].subtitle}
								genres={banners[currentBanner].genres}
								isImageLoaded={isImageLoaded}
								isHovered={isHovered}
							/>
						</div>
					</div>
				</div>

				<BannerNavigation
					totalBanners={banners.length}
					currentBanner={currentBanner}
					onNext={() => handleNavigate('next')}
					onPrev={() => handleNavigate('prev')}
					onGoTo={handleGoToBanner}
				/>
			</div>
		</div>
	);
}
