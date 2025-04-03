import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ScrollInfinite } from '@/components/scroll-infinite';
import { GamesCard } from '@/components/GamesCard';
import { useGames } from '@/hooks/use-games';
import { gameService } from '@/lib/api-service';

// Mock the API service
jest.mock('@/lib/api-service', () => ({
	gameService: {
		getGames: jest.fn(),
		getGamesByPage: jest.fn(),
		getFeaturedGames: jest.fn(),
		getGameById: jest.fn(),
	},
}));

// Mock the useGames hook
jest.mock('@/hooks/use-games');

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
		this.element = element;
	});

	unobserve = jest.fn();
	disconnect = jest.fn();
	takeRecords = jest.fn();
	element: Element | null = null;

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

// Set up mock for IntersectionObserver
global.IntersectionObserver =
	MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock components that might be difficult to test
jest.mock('@/components/GamesCard/game-grid', () => ({
	__esModule: true,
	default: ({ games }: { games: any[] }) => (
		<div data-testid="game-grid">
			{games.map((game) => (
				<div key={game.id} data-testid={`game-${game.id}`}>
					{game.name}
				</div>
			))}
		</div>
	),
}));

jest.mock('@/components/GamesCard/game-grid-skeleton', () => ({
	GameGridSkeleton: () => (
		<div data-testid="game-grid-skeleton">Loading...</div>
	),
}));

jest.mock('@/components/filter-bar', () => ({
	FilterBar: () => <div data-testid="filter-bar">Filter Bar</div>,
}));

// Sample game data
const mockGames = [
	{ id: 1, name: 'Game 1', background_image: 'image1.jpg', rating: 4.5 },
	{ id: 2, name: 'Game 2', background_image: 'image2.jpg', rating: 4.2 },
	{ id: 3, name: 'Game 3', background_image: 'image3.jpg', rating: 4.8 },
];

const mockGamesBatch2 = [
	{ id: 4, name: 'Game 4', background_image: 'image4.jpg', rating: 4.3 },
	{ id: 5, name: 'Game 5', background_image: 'image5.jpg', rating: 4.7 },
];

describe('Infinite Scroll with Games Integration Tests', () => {
	const mockLoadMoreGames = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock useGames hook with initial data
		(useGames as jest.Mock).mockReturnValue({
			allGames: mockGames,
			loading: false,
			initialLoading: false,
			shouldShowLoading: false,
			error: null,
			isEndOfContent: false,
			visibleItems: { 1: true, 2: true, 3: true },
			loadMoreGames: mockLoadMoreGames,
			page: 1,
			resetGames: jest.fn(),
		});

		// Mock API responses
		(gameService.getGames as jest.Mock).mockResolvedValue(mockGames);
		(gameService.getGamesByPage as jest.Mock).mockResolvedValue(
			mockGamesBatch2
		);
	});

	test('GamesCard renders initial games and shows infinite scroll component', async () => {
		render(<GamesCard onScrollToTop={() => {}} />);

		// Check title is rendered
		expect(screen.getByText('Explore High-Rating Games')).toBeInTheDocument();

		// Check filter bar is rendered
		expect(screen.getByTestId('filter-bar')).toBeInTheDocument();

		// Wait for games to be displayed
		await waitFor(() => {
			expect(screen.getByTestId('game-grid')).toBeInTheDocument();
		});

		// Check infinite scroll trigger is rendered
		expect(screen.getByTestId('infinite-scroll-trigger')).toBeInTheDocument();

		// Expect "Scroll for more games" text to be visible since hasMore is true
		expect(screen.getByText('Scroll for more games')).toBeInTheDocument();
	});

	test('loadMoreGames is called when scrolling to bottom and more games are loaded', async () => {
		render(<GamesCard onScrollToTop={() => {}} />);

		// Get the observer from the mock
		const observer =
			global.IntersectionObserver as unknown as MockIntersectionObserver;

		// Initial games should be rendered
		await waitFor(() => {
			expect(screen.getByTestId('game-grid')).toBeInTheDocument();
		});

		// Simulate intersection (user scrolled to bottom)
		act(() => {
			observer.simulateIntersection(true);
		});

		// Check that loadMoreGames was called
		expect(mockLoadMoreGames).toHaveBeenCalledTimes(1);

		// Now simulate that more games were loaded
		(useGames as jest.Mock).mockReturnValue({
			allGames: [...mockGames, ...mockGamesBatch2],
			loading: false,
			initialLoading: false,
			shouldShowLoading: false,
			error: null,
			isEndOfContent: false,
			visibleItems: { 1: true, 2: true, 3: true, 4: true, 5: true },
			loadMoreGames: mockLoadMoreGames,
			page: 2,
			resetGames: jest.fn(),
		});

		// Re-render with updated games
		const { rerender } = render(<GamesCard onScrollToTop={() => {}} />);
		rerender(<GamesCard onScrollToTop={() => {}} />);

		// New games should be displayed
		await waitFor(() => {
			expect(screen.getByTestId('game-grid')).toBeInTheDocument();
			// Check for one of the new games
			expect(screen.getByText('Game 4')).toBeInTheDocument();
			expect(screen.getByText('Game 5')).toBeInTheDocument();
		});
	});

	test('shows end of content message when no more games are available', async () => {
		// Mock that we're at the end of content
		(useGames as jest.Mock).mockReturnValue({
			allGames: [...mockGames, ...mockGamesBatch2],
			loading: false,
			initialLoading: false,
			shouldShowLoading: false,
			error: null,
			isEndOfContent: true,
			visibleItems: { 1: true, 2: true, 3: true, 4: true, 5: true },
			loadMoreGames: mockLoadMoreGames,
			page: 2,
			resetGames: jest.fn(),
		});

		render(<GamesCard onScrollToTop={() => {}} />);

		// Wait for games to be displayed
		await waitFor(() => {
			expect(screen.getByTestId('game-grid')).toBeInTheDocument();
		});

		// End of content message should be visible
		expect(screen.getByText("You've seen all games")).toBeInTheDocument();
	});

	test('shows loading state when fetching more games', async () => {
		// First render with initial games
		const { rerender } = render(<GamesCard onScrollToTop={() => {}} />);

		// Then update to loading state
		(useGames as jest.Mock).mockReturnValue({
			allGames: mockGames,
			loading: true,
			initialLoading: false,
			shouldShowLoading: false,
			error: null,
			isEndOfContent: false,
			visibleItems: { 1: true, 2: true, 3: true },
			loadMoreGames: mockLoadMoreGames,
			page: 1,
			resetGames: jest.fn(),
		});

		rerender(<GamesCard onScrollToTop={() => {}} />);

		// Loading indicator should be visible in the infinite scroll component
		expect(
			screen.getByTestId('infinite-scroll-trigger').textContent
		).not.toContain('Scroll for more games');
	});

	test('displays error message when loading games fails', async () => {
		// Mock the error state
		(useGames as jest.Mock).mockReturnValue({
			allGames: [],
			loading: false,
			initialLoading: false,
			shouldShowLoading: false,
			error: 'Failed to load games. Please try again later.',
			isEndOfContent: false,
			visibleItems: {},
			loadMoreGames: mockLoadMoreGames,
			page: 1,
			resetGames: jest.fn(),
		});

		render(<GamesCard onScrollToTop={() => {}} />);

		// Error message should be displayed
		expect(
			screen.getByText('Failed to load games. Please try again later.')
		).toBeInTheDocument();
	});
});
