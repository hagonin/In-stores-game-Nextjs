import { Game } from "@/lib/types";

export const groupGamesIntoRows = (
	games: Game[],
	isMobile: boolean,
	isTablet: boolean
): Game[][] => {
	if (!games || games.length === 0) return [];

	const rows: Game[][] = [];
	let currentIndex = 0;

	if (isMobile) {
		// Mobile: 1 game per row
		while (currentIndex < games.length) {
			rows.push(games.slice(currentIndex, currentIndex + 1));
			currentIndex += 1;
		}
	} else if (isTablet) {
		// Tablet: 2 games per row
		while (currentIndex < games.length) {
			rows.push(games.slice(currentIndex, currentIndex + 2));
			currentIndex += 2;
		}
	} else {
		// Desktop: Follow the 3/4/2 pattern
		const pattern = [3, 4, 2];
		let patternIndex = 0;

		while (currentIndex < games.length) {
			const rowSize = pattern[patternIndex % pattern.length];
			const rowCount = Math.min(rowSize, games.length - currentIndex);

			rows.push(games.slice(currentIndex, currentIndex + rowCount));
			currentIndex += rowCount;
			patternIndex++;
		}
	}

	return rows;
};
