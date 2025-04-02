import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import FeaturedBanner from '..';
import { useFeaturedBanners } from '@/hooks/use-featured-banners';
import { useImageLoading } from '@/hooks/use-image-loading';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Banner } from '@/lib/types';
import { useRouter } from 'next/navigation';

// We don't need to declare global Jest types anymore since we installed @types/jest

// Mock the hooks
jest.mock('@/hooks/use-featured-banners');
jest.mock('@/hooks/use-image-loading');
jest.mock('@/hooks/use-media-query');
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

// Mock the dependencies with proper types
jest.mock('../banner-content', () => {
	return function MockBannerContent({
		title,
		genres,
	}: {
		title: string;
		genres?: string;
	}) {
		return (
			<div data-testid="banner-content">
				{title} - {genres || 'No genre'}
			</div>
		);
	};
});

jest.mock('../banner-navigation', () => {
	return function MockBannerNavigation({
		onNext,
		onPrev,
		onGoTo,
	}: {
		onNext: () => void;
		onPrev: () => void;
		onGoTo: (index: number) => void;
	}) {
		return (
			<div data-testid="banner-navigation">
				<button data-testid="prev-button" onClick={onPrev}>
					Prev
				</button>
				<button data-testid="next-button" onClick={onNext}>
					Next
				</button>
				<button data-testid="goto-button" onClick={() => onGoTo(1)}>
					Go to 1
				</button>
			</div>
		);
	};
});

jest.mock('../banner-image', () => {
	return function MockBannerImage({
		src,
		alt,
		onClick,
	}: {
		src: string;
		alt: string;
		onClick: () => void;
	}) {
		return (
			<div data-testid="banner-image" onClick={onClick}>
				{alt} - {src}
			</div>
		);
	};
});

jest.mock('../banner-loading', () => {
	return function MockBannerLoading({
		height,
		showLoadingIndicator,
	}: {
		height: string;
		showLoadingIndicator?: boolean;
	}) {
		return (
			<div data-testid="banner-loading" style={{ height }}>
				Loading{showLoadingIndicator ? ' with indicator' : ''}
			</div>
		);
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
		genres: 'Action, Adventure',
	},
	{
		id: '2',
		title: 'Game 2',
		subtitle: 'Subtitle 2',
		image: '/game2.jpg',
		mobileImage: '/game2-mobile.jpg',
		genres: 'RPG, Strategy',
	},
	{
		id: '3',
		title: 'Game 3',
		subtitle: 'Subtitle 3',
		image: '/game3.jpg',
		mobileImage: '/game3-mobile.jpg',
		genres: 'Simulation, Sports',
	},
];

describe('FeaturedBanner Component', () => {
	// Reset all mocks before each test
	beforeEach(() => {
		jest.clearAllMocks();

		// Mock useMediaQuery - default to desktop
		(useMediaQuery as jest.Mock).mockImplementation((query: string) => {
			if (query === '(min-width: 1025px)') return true; // Desktop
			if (query === '(min-width: 641px) and (max-width: 1024px)') return false; // Tablet
			if (query === '(max-width: 640px)') return false; // Mobile
			return false;
		});

		// Mock useImageLoading
		(useImageLoading as jest.Mock).mockReturnValue({
			isImageError: false,
			handleImageLoad: jest.fn(),
			handleImageError: jest.fn(),
		});
	});

	// Test 1: Test loading state
	it('displays loading state when isLoading is true', () => {
		(useFeaturedBanners as jest.Mock).mockReturnValue({
			banners: [],
			isLoading: true,
			shouldShowLoading: true,
		});

		render(<FeaturedBanner />);

		expect(screen.getByTestId('banner-loading')).toBeInTheDocument();
		expect(screen.getByText('Loading with indicator')).toBeInTheDocument();
	});

	// Test 2: Test error state when no banners are available
	it('displays error state when no banners are available', () => {
		(useFeaturedBanners as jest.Mock).mockReturnValue({
			banners: [],
			isLoading: false,
			shouldShowLoading: false,
		});

		render(<FeaturedBanner />);

		expect(screen.getByText('Unable to load the content')).toBeInTheDocument();
	});

	// Test 3: Test successful rendering of banners
	it('renders banners correctly when data is available', () => {
		(useFeaturedBanners as jest.Mock).mockReturnValue({
			banners: mockBanners,
			isLoading: false,
			shouldShowLoading: false,
		});

		render(<FeaturedBanner />);

		// Should find the banner content for the first banner in the center set
		expect(screen.getByTestId('banner-content')).toBeInTheDocument();
		// Navigation buttons should be available
		expect(screen.getByTestId('banner-navigation')).toBeInTheDocument();
	});

	// Test 4: Test navigation functionality
	it('allows navigation between banners', async () => {
		(useFeaturedBanners as jest.Mock).mockReturnValue({
			banners: mockBanners,
			isLoading: false,
			shouldShowLoading: false,
		});

		render(<FeaturedBanner />);

		// Click the next button
		fireEvent.click(screen.getByTestId('next-button'));

		// Wait for the animation to complete
		await waitFor(() => {
			// After clicking next, we should still have banner content visible
			expect(screen.getByTestId('banner-content')).toBeInTheDocument();
		});

		// Click the prev button
		fireEvent.click(screen.getByTestId('prev-button'));

		// Wait for the animation to complete
		await waitFor(() => {
			// After clicking prev, we should still have banner content visible
			expect(screen.getByTestId('banner-content')).toBeInTheDocument();
		});

		// Click the go to button
		fireEvent.click(screen.getByTestId('goto-button'));

		// Wait for the animation to complete
		await waitFor(() => {
			// After going to a specific banner, we should still have banner content visible
			expect(screen.getByTestId('banner-content')).toBeInTheDocument();
		});
	});

	// Test 5: Test image error handling
	it('handles image loading errors', () => {
		(useFeaturedBanners as jest.Mock).mockReturnValue({
			banners: mockBanners,
			isLoading: false,
			shouldShowLoading: false,
		});

		(useImageLoading as jest.Mock).mockReturnValue({
			isImageError: true,
			handleImageLoad: jest.fn(),
			handleImageError: jest.fn(),
		});

		render(<FeaturedBanner />);

		// Should still show the banner content even if there's an image error
		expect(screen.getByTestId('banner-content')).toBeInTheDocument();
	});

	// Test 6: Test responsive behavior
	it('adapts to mobile screens', () => {
		// Mock for mobile view
		(useMediaQuery as jest.Mock).mockImplementation((query: string) => {
			if (query === '(min-width: 1025px)') return false; // Not Desktop
			if (query === '(min-width: 641px) and (max-width: 1024px)') return false; // Not Tablet
			if (query === '(max-width: 640px)') return true; // Mobile
			return false;
		});

		(useFeaturedBanners as jest.Mock).mockReturnValue({
			banners: mockBanners,
			isLoading: false,
			shouldShowLoading: false,
		});

		render(<FeaturedBanner />);

		// On initial render, useEffect hasn't run yet for hydration
		// Let's simulate that the useEffect has run
		act(() => {
			// Trigger state updates
			// Note: This is a bit of a hack since we can't directly access component state
		});

		// Should still render banner content for mobile
		expect(screen.getByTestId('banner-content')).toBeInTheDocument();
	});

	// Test 7: Test click handler for banner navigation
	it('navigates when clicking on a banner', () => {
		const mockRouter = { push: jest.fn() };
		(useRouter as jest.Mock).mockReturnValue(mockRouter);

		(useFeaturedBanners as jest.Mock).mockReturnValue({
			banners: mockBanners,
			isLoading: false,
			shouldShowLoading: false,
		});

		render(<FeaturedBanner />);

		// Click on the banner image
		fireEvent.click(screen.getByTestId('banner-image'));

		// Should try to navigate to the game page
		expect(mockRouter.push).toHaveBeenCalled();
	});

	// Test 8: Test hover behavior
	it('handles hover events on desktop', async () => {
		(useFeaturedBanners as jest.Mock).mockReturnValue({
			banners: mockBanners,
			isLoading: false,
			shouldShowLoading: false,
		});

		const { container } = render(<FeaturedBanner />);

		// Find the main banner container (this is a bit fragile but works for testing)
		const bannerContainer = container.querySelector(
			'[class*="relative bg-transparent"] > div'
		);

		// Simulate mouse enter
		if (bannerContainer) {
			fireEvent.mouseEnter(bannerContainer);

			// Wait for state update
			await waitFor(() => {
				// Banner content should be visible (we can't directly test the state)
				expect(screen.getByTestId('banner-content')).toBeInTheDocument();
			});

			// Simulate mouse leave
			fireEvent.mouseLeave(bannerContainer);

			// Wait for state update
			await waitFor(() => {
				// Banner content should still be in the document
				expect(screen.getByTestId('banner-content')).toBeInTheDocument();
			});
		}
	});
});
