import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
};

// Function to generate rows following the exact same pattern as the main grid
export const getGridRows = (isMobile: boolean, isTablet: boolean): number[] => {
	if (isMobile) {
		// Mobile: 1 card per row
		return Array(9).fill(1);
	} else if (isTablet) {
		// Tablet: 2 cards per row
		return Array(5).fill(2);
	} else {
		// Desktop: Follow the exact 3/4/2/3/4/2 pattern
		return [3, 4, 2, 3, 4, 2];
	}
};

// Get card height class based on size - matches exact same sizes as GameCard component
export const getCardHeightClass = (size: 'normal' | 'large' | 'small') => {
	switch (size) {
		case 'small':
			return 'h-[200px] sm:h-[225px] md:h-[281px]';
		case 'large':
			return 'h-[300px] sm:h-[325px] md:h-[349px]';
		default:
			return 'h-[250px] sm:h-[275px] md:h-[231px]';
	}
};

// function to get size configuration
// export const getCardHeightClass = (size: 'small' | 'large' | 'normal') => {
// 	switch (size) {
// 		case 'small':
// 			return {
// 				aspectRatio: 'aspect-[305/225]',
// 				maxWidth: 'max-w-[305px]',
// 			};
// 		case 'large':
// 			return {
// 				aspectRatio: 'aspect-[631/349]',
// 				maxWidth: 'max-w-[631px]',
// 			};
// 		case 'normal':
// 		default:
// 			return {
// 				aspectRatio: 'aspect-[410/281]',
// 				maxWidth: 'max-w-[410px]',
// 			};
// 	}
// };