// hooks/use-visible-items.ts
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage visibility state of items for animations
 *
 * @param items - Array of items to track visibility for
 * @param options - Configuration options for visibility behavior
 * @returns Object containing visible items record and helper functions
 */
export function useVisibleItems<T extends { id: string | number }>(
	items: T[],
	options?: {
		initialDelay?: number;
		staggerDelay?: number;
		shouldReset?: boolean;
	}
) {
	const {
		initialDelay = 100,
		staggerDelay = 100,
		shouldReset = true,
	} = options || {};

	const [visibleItems, setVisibleItems] = useState<
		Record<string | number, boolean>
	>({});

	// Reset visibility when items change
	useEffect(() => {
		if (shouldReset) {
			setVisibleItems({});
		}

		if (items.length === 0) return;

		// Show items with a staggered delay
		const timeouts: NodeJS.Timeout[] = [];

		items.forEach((item, index) => {
			const timeout = setTimeout(() => {
				setVisibleItems((prev) => ({
					...prev,
					[item.id]: true,
				}));
			}, initialDelay + index * staggerDelay);

			timeouts.push(timeout);
		});

		// Clean up timeouts
		return () => {
			timeouts.forEach((timeout) => clearTimeout(timeout));
		};
	}, [items, initialDelay, staggerDelay, shouldReset]);

	// Set a specific item's visibility
	const setItemVisibility = useCallback(
		(id: string | number, isVisible: boolean) => {
			setVisibleItems((prev) => ({
				...prev,
				[id]: isVisible,
			}));
		},
		[]
	);

	// Set all items visible or hidden
	const setAllVisibility = useCallback(
		(isVisible: boolean) => {
			const newState: Record<string | number, boolean> = {};
			items.forEach((item) => {
				newState[item.id] = isVisible;
			});
			setVisibleItems(newState);
		},
		[items]
	);

	return {
		visibleItems,
		setItemVisibility,
		setAllVisibility,
		isVisible: (id: string | number) => !!visibleItems[id],
	};
}
