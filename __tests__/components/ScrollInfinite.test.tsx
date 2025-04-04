import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ScrollInfinite } from '@/components/scroll-infinite';

// Create a mock implementation of IntersectionObserver
class MockIntersectionObserver {
	callback: IntersectionObserverCallback;
	elements: Element[] = [];

	constructor(callback: IntersectionObserverCallback) {
		this.callback = callback;
	}

	observe(element: Element): void {
		this.elements.push(element);
	}

	unobserve(element: Element): void {
		this.elements = this.elements.filter((el) => el !== element);
	}

	disconnect(): void {
		this.elements = [];
	}

	// Helper to simulate intersection
	simulateIntersection(isIntersecting: boolean): void {
		if (this.elements.length > 0) {
			const entries = this.elements.map((element) => ({
				isIntersecting,
				target: element,
				boundingClientRect: element.getBoundingClientRect(),
				intersectionRatio: isIntersecting ? 1 : 0,
				intersectionRect: isIntersecting
					? element.getBoundingClientRect()
					: new DOMRect(),
				rootBounds: null,
				time: Date.now(),
			}));

			this.callback(entries, this as unknown as IntersectionObserver);
		}
	}
}

describe('ScrollInfinite', () => {
	const originalIntersectionObserver = global.IntersectionObserver;

	beforeAll(() => {
		// Replace the global IntersectionObserver with our mock
		global.IntersectionObserver =
			MockIntersectionObserver as unknown as typeof IntersectionObserver;
	});

	afterAll(() => {
		// Restore the original IntersectionObserver
		global.IntersectionObserver = originalIntersectionObserver;
	});

	test('renders loading state when loading is true', () => {
		render(
			<ScrollInfinite onLoadMore={jest.fn()} loading={true} hasMore={true} />
		);

		expect(screen.getByText(/loading more content/i)).toBeInTheDocument();
	});

	test('renders "no more content" message when hasMore is false', () => {
		render(
			<ScrollInfinite onLoadMore={jest.fn()} loading={false} hasMore={false} />
		);

		expect(screen.getByText(/you've reached the end/i)).toBeInTheDocument();
	});

	test('renders scroll message when not loading and hasMore is true', () => {
		render(
			<ScrollInfinite onLoadMore={jest.fn()} loading={false} hasMore={true} />
		);

		expect(screen.getByText(/scroll for more content/i)).toBeInTheDocument();
	});

	test('calls onLoadMore when intersecting and hasMore is true', () => {
		const mockOnLoadMore = jest.fn();

		render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={false}
				hasMore={true}
			/>
		);

		const observer =
			global.IntersectionObserver as unknown as MockIntersectionObserver;

		// Make sure we have an element to observe before simulating intersection
		expect(observer.elements.length).toBeGreaterThan(0);

		// Simulate intersection
		act(() => {
			observer.simulateIntersection(true);
		});

		// onLoadMore should be called
		expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
	});

	test('does not call onLoadMore when loading is true', () => {
		const mockOnLoadMore = jest.fn();

		render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={true}
				hasMore={true}
			/>
		);

		const observer =
			global.IntersectionObserver as unknown as MockIntersectionObserver;

		// Simulate intersection
		act(() => {
			observer.simulateIntersection(true);
		});

		// onLoadMore should not be called because loading is true
		expect(mockOnLoadMore).not.toHaveBeenCalled();
	});

	test('does not call onLoadMore when hasMore is false', () => {
		const mockOnLoadMore = jest.fn();

		render(
			<ScrollInfinite
				onLoadMore={mockOnLoadMore}
				loading={false}
				hasMore={false}
			/>
		);

		const observer =
			global.IntersectionObserver as unknown as MockIntersectionObserver;

		// Simulate intersection
		act(() => {
			observer.simulateIntersection(true);
		});

		// onLoadMore should not be called because hasMore is false
		expect(mockOnLoadMore).not.toHaveBeenCalled();
	});

	test('disconnects observer on unmount', () => {
		const { unmount } = render(
			<ScrollInfinite onLoadMore={jest.fn()} loading={false} hasMore={true} />
		);

		const observer =
			global.IntersectionObserver as unknown as MockIntersectionObserver;
		const disconnectSpy = jest.spyOn(observer, 'disconnect');

		// Unmount the component
		unmount();

		// Observer should be disconnected
		expect(disconnectSpy).toHaveBeenCalled();
	});
});
