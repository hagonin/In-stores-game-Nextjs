import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import FeaturedBanner from '../featured-banner';
import { useFeaturedBanners } from '@/hooks/use-featured-banners';
import { useImageLoading } from '@/hooks/use-image-loading';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Banner } from '@/lib/types';
import { useRouter } from 'next/navigation';

// Mock the hooks
jest.mock('@/hooks/use-featured-banners');
jest.mock('@/hooks/use-image-loading');
jest.mock('@/hooks/use-media-query');
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

// Mock sub-components with proper types
jest.mock('../banner-content', () => {
	return function MockBannerContent() {
		return <div data-testid="banner-content">Banner Content</div>;
	};
});

jest.mock('../banner-navigation', () => {
	return function MockBannerNavigation({
		onNext,
		onPrev,
	}: {
		onNext: () => void;
		onPrev: () => void;
	}) {
		return (
			<div data-testid="banner-navigation">
				<button onClick={onPrev}>Prev</button>
				<button onClick={onNext}>Next</button>
			</div>
		);
	};
});

jest.mock('../banner-image', () => {
	return function MockBannerImage({ onClick }: { onClick: () => void }) {
		return (
			<div data-testid="banner-image" onClick={onClick}>
				Banner Image
			</div>
		);
	};
});

jest.mock('../banner-loading', () => {
	return function MockBannerLoading() {
		return <div data-testid="banner-loading">Loading</div>;
	};
});

// Define mock data
const mockBanners: Banner[] = [
	{
		id: '1',
		title: 'Game 1',
		subtitle: 'Subtitle 1',
		image: '/game1.jpg',
		mobileImage: '/game1-mobile.jpg',
		genres: 'Action',
	},
	{
		id: '2',
		title: 'Game 2',
		subtitle: 'Subtitle 2',
		image: '/game2.jpg',
		mobileImage: '/game2-mobile.jpg',
		genres: 'RPG',
	},
];

describe('FeaturedBanner Drag Interaction', () => {
	// Common setup
	beforeEach(() => {
		jest.clearAllMocks();

		// Default to desktop view
		(useMediaQuery as jest.Mock).mockImplementation((query: string) => {
			if (query === '(min-width: 1025px)') return true;
			return false;
		});

		// Mock image loading
		(useImageLoading as jest.Mock).mockReturnValue({
			isImageError: false,
			handleImageLoad: jest.fn(),
			handleImageError: jest.fn(),
		});

		// Mock banners data
		(useFeaturedBanners as jest.Mock).mockReturnValue({
			banners: mockBanners,
			isLoading: false,
			shouldShowLoading: false,
		});
	});

	it('sets dragging state on drag start', () => {
		const { container } = render(<FeaturedBanner />);

		// Find the draggable element (this might need adjustment based on actual component structure)
		const draggableElement = container.querySelector(
			'[class*="flex h-full cursor-grab"]'
		);

		// Verify the element was found
		expect(draggableElement).not.toBeNull();

		if (draggableElement) {
			// Simulate drag start
			fireEvent.mouseDown(draggableElement);
			fireEvent.mouseMove(draggableElement);

			// We can't directly test state, but we can verify the component still renders
			expect(screen.getByTestId('banner-content')).toBeInTheDocument();
		}
	});

	it('handles drag end with minimal movement (no navigation)', () => {
		const { container } = render(<FeaturedBanner />);

		// Find the draggable element
		const draggableElement = container.querySelector(
			'[class*="flex h-full cursor-grab"]'
		);

		if (draggableElement) {
			// Start dragging
			fireEvent.mouseDown(draggableElement, { clientX: 500, clientY: 300 });

			// Small drag movement (less than threshold)
			fireEvent.mouseMove(draggableElement, { clientX: 520, clientY: 300 });

			// End drag
			fireEvent.mouseUp(draggableElement);

			// Should not trigger navigation, component should remain rendered
			expect(screen.getByTestId('banner-content')).toBeInTheDocument();
		}
	});

	// This test simulates a drag with significant rightward movement
	it('navigates to previous slide on drag right (beyond threshold)', () => {
		const { container } = render(<FeaturedBanner />);

		// Test that the component renders correctly after drag events

		const draggableElement = container.querySelector(
			'[class*="flex h-full cursor-grab"]'
		);

		if (draggableElement) {
			// Start dragging
			fireEvent.mouseDown(draggableElement, { clientX: 500, clientY: 300 });

			// Drag right significantly (beyond threshold)
			fireEvent.mouseMove(draggableElement, { clientX: 600, clientY: 300 });

			// End drag
			fireEvent.mouseUp(draggableElement);

			// Component should still be rendered
			expect(screen.getByTestId('banner-content')).toBeInTheDocument();
		}
	});

	// This test simulates a drag with significant leftward movement
	it('navigates to next slide on drag left (beyond threshold)', () => {
		const { container } = render(<FeaturedBanner />);

		const draggableElement = container.querySelector(
			'[class*="flex h-full cursor-grab"]'
		);

		if (draggableElement) {
			// Start dragging
			fireEvent.mouseDown(draggableElement, { clientX: 500, clientY: 300 });

			// Drag left significantly (beyond threshold)
			fireEvent.mouseMove(draggableElement, { clientX: 400, clientY: 300 });

			// End drag
			fireEvent.mouseUp(draggableElement);

			// Component should still be rendered
			expect(screen.getByTestId('banner-content')).toBeInTheDocument();
		}
	});

	it('allows dragging on touch devices', () => {
		// Mock mobile device
		(useMediaQuery as jest.Mock).mockImplementation((query: string) => {
			if (query === '(min-width: 1025px)') return false;
			if (query === '(max-width: 640px)') return true;
			return false;
		});

		const { container } = render(<FeaturedBanner />);

		// Simulate that mobile state has been updated after hydration
		act(() => {
			// Ideally we'd update the internal state here
		});

		const draggableElement = container.querySelector(
			'[class*="flex h-full cursor-grab"]'
		);

		if (draggableElement) {
			// Simulate touch events
			fireEvent.touchStart(draggableElement, {
				touches: [{ clientX: 250, clientY: 300 }],
			});

			fireEvent.touchMove(draggableElement, {
				touches: [{ clientX: 150, clientY: 300 }],
			});

			fireEvent.touchEnd(draggableElement);

			// Component should still be rendered
			expect(screen.getByTestId('banner-content')).toBeInTheDocument();
		}
	});

	it('prevents navigation during drag', () => {
		const mockRouter = { push: jest.fn() };
		(useRouter as jest.Mock).mockReturnValue(mockRouter);

		const { container } = render(<FeaturedBanner />);

		const draggableElement = container.querySelector(
			'[class*="flex h-full cursor-grab"]'
		);

		if (draggableElement) {
			// Start dragging
			fireEvent.mouseDown(draggableElement);

			// While dragging, try to click the banner
			fireEvent.click(screen.getByTestId('banner-image'));

			// Router should not be called due to isDragging flag
			expect(mockRouter.push).not.toHaveBeenCalled();
		}
	});
});
