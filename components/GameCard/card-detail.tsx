import { GameById } from '@/lib/types';

interface CardInfoProps {
	game: GameById;
}

export function CardInfo({ game }: CardInfoProps) {
	return (
		<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-12 rounded-b-2xl">
			<h3 className="font-semibold text-white text-sm sm:text-base md:text-lg leading-tight mb-1">
				{game.name}
			</h3>
			<p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
				{game.description || 'Experience this exciting game adventure'}
			</p>
		</div>
	);
}
