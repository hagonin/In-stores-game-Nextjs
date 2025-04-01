'use client';

import { useRef } from 'react';
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
import BannerImage  from './banner-image';
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
	const { currentBanner, nextBanner, prevBanner, goToBanner } =
		useBannerNavigation(banners);

	const bannerRef = useRef<HTMLDivElement>(null);

	const isMobile = useMediaQuery('(max-width: 640px)');
	const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

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

					<div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent">
						<BannerContent
							title={banners[currentBanner].title}
							genres={banners[currentBanner].genres}
							isImageLoaded={isImageLoaded}
						/>
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
