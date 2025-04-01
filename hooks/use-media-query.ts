import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
	// Initialize with a default value of false
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		// Only run on client side
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia(query);

			// Set initial value
			setMatches(mediaQuery.matches);

			// Create event listener for changes
			const handleChange = (event: MediaQueryListEvent) => {
				setMatches(event.matches);
			};

			// Add event listener
			mediaQuery.addEventListener('change', handleChange);

			// Clean up
			return () => {
				mediaQuery.removeEventListener('change', handleChange);
			};
		}
	}, [query]);

	return matches;
}
