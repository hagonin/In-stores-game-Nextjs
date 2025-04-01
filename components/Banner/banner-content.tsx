interface BannerContentProps {
	title: string;
	isImageLoaded: boolean;
	genres?: string;
}

export default function BannerContent({
	title,
	genres,
	isImageLoaded,
}: BannerContentProps) {
	// Don't render content if image is not loaded yet
	if (!isImageLoaded) {
		return null;
	}

	return (
		<div className="p-4 sm:p-6 md:p-8">
			{genres && (
				<div className="inline-block bg-blue-500/80 backdrop-blur-sm py-1 px-3 rounded-2xl text-white text-xs font-medium tracking-wide mb-2">
					{genres}
				</div>
			)}

			<h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-white cursor-pointer">
				{title}
			</h2>
		</div>
	);
}
