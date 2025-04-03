import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ScrollInfinite } from '@/components/scroll-infinite';

// Mock the IntersectionObserver
class MockIntersectionObserver {
	constructor(callback: IntersectionObserverCallback) {
		this.callback = callback;
	}

	readonly root = null;
	readonly rootMargin = '';
	readonly thresholds = [];
	readonly callback: IntersectionObserverCallback;

	observe = jest.fn((element: Element) => {
		// Store the element for later simulation
		this.element = element;
	});

	unobserve = jest.fn();
	disconnect = jest.fn();
	takeRecords = jest.fn();
	element: Element | null = null;

	// Helper method to simulate intersection
	simulateIntersection(isIntersecting: boolean) {
		if (!this.element) return;

		const entry = [
			{
				boundingClientRect: {} as DOMRectReadOnly,
				intersectionRatio: isIntersecting ? 1 : 0,
				intersectionRect: {} as DOMRectReadOnly,
				isIntersecting,
				rootBounds: null,
				target: this.element,
				time: Date.now(),
			},
		];

		this.callback(entry, this);
	}
}

// Replace the global IntersectionObserver with our mock
global.IntersectionObserver =
	MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe('ScrollInfinite Component', () => {
	const mockOnLoadMore = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('renders loading component when loading is true', () => {
		render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={true}
				hasMore={true}
				loadingComponent={<div data-testid="loading-indicator">Loading...</div>}
			/>
		);

		expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	test('renders "Scroll for more games" when not loading and has more content', () => {
		render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={false}
				hasMore={true}
			/>
		);

		expect(screen.getByText('Scroll for more games')).toBeInTheDocument();
	});

	test('renders "You\'ve seen all games" when no more content is available', () => {
		render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={false}
				hasMore={false}
			/>
		);

		expect(screen.getByText("You've seen all games")).toBeInTheDocument();
	});

	test('calls onLoadMore when intersection is detected and hasMore is true', async () => {
		const { container } = render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={false}
				hasMore={true}
			/>
		);

		// Get the IntersectionObserver instance
		const scrollTrigger = container.querySelector(
			'[data-testid="infinite-scroll-trigger"]'
		);
		expect(scrollTrigger).toBeInTheDocument();

		// Get the observer from the mock
		const observer =
			global.IntersectionObserver as unknown as MockIntersectionObserver;

		// Simulate intersection
		observer.simulateIntersection(true);

		// Check if onLoadMore was called
		expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
	});

	test('does not call onLoadMore when intersection is detected but loading is true', () => {
		render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={true}
				hasMore={true}
			/>
		);

		// Get the observer from the mock
		const observer =
			global.IntersectionObserver as unknown as MockIntersectionObserver;

		// Simulate intersection
		observer.simulateIntersection(true);

		// Check that onLoadMore was not called
		expect(mockOnLoadMore).not.toHaveBeenCalled();
	});

	test('does not call onLoadMore when intersection is detected but hasMore is false', () => {
		render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={false}
				hasMore={false}
			/>
		);

		// Get the observer from the mock
		const observer =
			global.IntersectionObserver as unknown as MockIntersectionObserver;

		// Simulate intersection
		observer.simulateIntersection(true);

		// Check that onLoadMore was not called
		expect(mockOnLoadMore).not.toHaveBeenCalled();
	});

	test('cleans up the observer on unmount', () => {
		const { unmount } = render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={false}
				hasMore={true}
			/>
		);

		// Get the observer from the mock
		const observer =
			global.IntersectionObserver as unknown as MockIntersectionObserver;

		// Unmount the component
		unmount();

		// Check that unobserve was called
		expect(observer.unobserve).toHaveBeenCalled();
	});

	test('component works with no references', () => {
		// This is an edge case test - the component should handle cases where the ref is null
		const originalRefCurrent = React.useRef<HTMLDivElement>().current;
		jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null });

		render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={false}
				hasMore={true}
			/>
		);

		// This test passes if no errors are thrown during render
		expect(true).toBeTruthy();

		// Reset the mock
		jest
			.spyOn(React, 'useRef')
			.mockReturnValueOnce({ current: originalRefCurrent });
	});
});
