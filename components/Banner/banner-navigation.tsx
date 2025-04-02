import { useMediaQuery } from '@/hooks/use-media-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface BannerNavigationProps {
	totalBanners: number;
	currentBanner: number;
	onNext: () => void;
	onPrev: () => void;
	onGoTo: (index: number) => void;
}

export default function BannerNavigation({
	totalBanners,
	currentBanner,
	onNext,
	onPrev,
	onGoTo,
}: BannerNavigationProps) {
	// Use media query to determine the device size
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<div className="absolute inset-0 z-10 pointer-events-none">
			{/* Centered Dots - Only visible on desktop  */}

			{isDesktop && (
				<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
					<div className="flex items-center gap-2">
						{Array.from({ length: totalBanners }).map((_, index) => (
							<button
								key={`indicator-${index}`}
								className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
									currentBanner === index
										? 'w-10 bg-white'
										: 'w-2.5 bg-white/50 hover:bg-white/80'
								}`}
								onClick={() => onGoTo(index)}
								aria-label={`Go to banner ${index + 1}`}
							/>
						))}
					</div>
				</div>
			)}

			<div
				className={`absolute pointer-events-auto bottom-6 right-0 transform -translate-x-1/2'
				}`}
			>
				<div className="flex items-center gap-2">
					<button
						className="p-2 bg-black/30 backdrop-blur-sm rounded-full grow-0 shrink-0 text-white hover:bg-black/50 transition-colors"
						onClick={onPrev}
						aria-label="Previous banner"
					>
						<ChevronLeft size={16} />
					</button>
					<button
						className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
						onClick={onNext}
						aria-label="Next banner"
					>
						<ChevronRight size={16} />
					</button>
				</div>
			</div>
		</div>
	);
}
