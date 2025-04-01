import { Skeleton } from '@/components/UI/skeleton'
import { LoadingIndicator } from '@/components/UI/loading-indicator';

interface BannerLoadingProps {
	height: string;
	showLoadingIndicator?: boolean;
}

export default function BannerLoading({
	height,
	showLoadingIndicator = false,
}: BannerLoadingProps) {
	// Extract just the height value for CSS variable or class mapping
	const heightClass = height.includes('px') ? `h-[${height}]` : height;

	if (showLoadingIndicator) {
		return (
			<div className="relative bg-transparent" data-testid="banner-loading">
				<div
					className={`min-w-7xl mx-auto relative overflow-hidden ${heightClass}`}
				>
					<Skeleton
						variant="rounded"
						className="absolute inset-0 w-full h-full"
					/>

					{/* Loading Indicator */}
					<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
						<LoadingIndicator
							size="medium"
							text="Please waiting..."
							color="#000000"
						/>
					</div>

					{/* Skeleton overlay for text content */}
					<div className="absolute bottom-0 left-0 right-0 z-10 p-10">
						<Skeleton variant="text" width={300} height={40} className="mb-4" />
						<Skeleton variant="text" width={220} height={24} className="mb-8" />
						<Skeleton variant="rounded" width={120} height={40} />
					</div>
				</div>
			</div>
		);
	}

	// Plain skeleton without loading indicator
	return (
		<div className="relative bg-transparent" data-testid="banner-loading">
			<div
				className={`min-w-7xl mx-auto relative overflow-hidden ${heightClass}`}
			>
				<Skeleton
					variant="rounded"
					className="absolute inset-0 w-full h-full"
				/>
			</div>
		</div>
	);
}
