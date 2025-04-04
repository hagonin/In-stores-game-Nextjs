import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import GamesCard from '@/components/Cards/games-card';
import { useGames } from '@/hooks/use-games';

// Mock the useGames hook
jest.mock('@/hooks/use-games');

// Create mock game data
const mockGames = [
	{
		id: 1,
		name: 'Game 1',
		background_image: 'image1.jpg',
		rating: 4.5,
		genres: [{ name: 'Action' }],
	},
	{
		id: 2,
		name: 'Game 2',
		background_image: 'image2.jpg',
		rating: 4.2,
		genres: [{ name: 'RPG' }],
	},
	{
		id: 3,
		name: 'Game 3',
		background_image: 'image3.jpg',
		rating: 4.0,
		genres: [{ name: 'Strategy' }],
	},
];

const mockGamesBatch2 = [
	{
		id: 4,
		name: 'Game 4',
		background_image: 'image4.jpg',
		rating: 4.7,
		genres: [{ name: 'Adventure' }],
	},
	{
		id: 5,
		name: 'Game 5',
		background_image: 'image5.jpg',
		rating: 3.9,
		genres: [{ name: 'Puzzle' }],
	},
];

// Create a mock implementation of IntersectionObserver
class MockIntersectionObserver {
	callback: IntersectionObserverCallback;
	elements: Element[] = [];

	constructor(callback: IntersectionObserverCallback) {
		this.callback = callback;
	}

	observe(element: Element) {
		this.elements.push(element);
	}

	unobserve(element: Element) {
		this.elements = this.elements.filter((el) => el !== element);
	}

	disconnect() {
		this.elements = [];
	}

	// Helper to simulate intersection
	simulateIntersection(isIntersecting: boolean) {
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

			this.callback(entries, this);
		}
	}
}

// Mock loadMoreGames function
const mockLoadMoreGames = jest.fn();

describe('Infinite Scroll with Games Integration Tests', () => {
	beforeAll(() => {
		// Replace the global IntersectionObserver with our mock
		global.IntersectionObserver =
			MockIntersectionObserver as unknown as typeof IntersectionObserver;
	});

	beforeEach(() => {
		// Reset mocks
		jest.clearAllMocks();

		// Setup default mock return values
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
	});

	test('renders initial game data', async () => {
		render(<GamesCard onScrollToTop={() => {}} />);

		await waitFor(() => {
			expect(screen.getByTestId('game-grid')).toBeInTheDocument();
			expect(screen.getByText('Game 1')).toBeInTheDocument();
			expect(screen.getByText('Game 2')).toBeInTheDocument();
			expect(screen.getByText('Game 3')).toBeInTheDocument();
		});
	});

	test('loadMoreGames is called when scrolling to bottom and more games are loaded', async () => {
		// Initial render with the first batch of games
		const { rerender } = render(<GamesCard onScrollToTop={() => {}} />);

		// Wait for initial render to complete
		await waitFor(
			() => {
				expect(screen.getByTestId('game-grid')).toBeInTheDocument();
				expect(screen.getByText('Game 1')).toBeInTheDocument();
			},
			{ timeout: 1000 }
		);

		// Get the observer from the mock
		const observer =
			global.IntersectionObserver as unknown as MockIntersectionObserver;

		// Make sure we have an element to observe before simulating intersection
		expect(observer.elements.length).toBeGreaterThan(0);

		// Simulate intersection (user scrolled to bottom)
		await act(async () => {
			observer.simulateIntersection(true);
			// Give React time to process the state update
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		// Check that loadMoreGames was called
		expect(mockLoadMoreGames).toHaveBeenCalledTimes(1);

		// Now simulate that more games were loaded by updating the mock
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
		rerender(<GamesCard onScrollToTop={() => {}} />);

		// New games should be displayed
		await waitFor(
			() => {
				expect(screen.getByText('Game 4')).toBeInTheDocument();
				expect(screen.getByText('Game 5')).toBeInTheDocument();
			},
			{ timeout: 1000 }
		);
	});

	test('shows end of content message when no more games', async () => {
		(useGames as jest.Mock).mockReturnValue({
			allGames: mockGames,
			loading: false,
			initialLoading: false,
			shouldShowLoading: false,
			error: null,
			isEndOfContent: true,
			visibleItems: { 1: true, 2: true, 3: true },
			loadMoreGames: mockLoadMoreGames,
			page: 1,
			resetGames: jest.fn(),
		});

		render(<GamesCard onScrollToTop={() => {}} />);

		await waitFor(() => {
			expect(screen.getByText(/you've reached the end/i)).toBeInTheDocument();
		});
	});

	test('shows loading state while loading more games', async () => {
		// Initial render with loading state
		(useGames as jest.Mock).mockReturnValue({
			allGames: mockGames,
			loading: true,
			initialLoading: false,
			shouldShowLoading: true,
			error: null,
			isEndOfContent: false,
			visibleItems: { 1: true, 2: true, 3: true },
			loadMoreGames: mockLoadMoreGames,
			page: 1,
			resetGames: jest.fn(),
		});

		render(<GamesCard onScrollToTop={() => {}} />);

		await waitFor(() => {
			expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
		});
	});

	test('shows error message when loading fails', async () => {
		(useGames as jest.Mock).mockReturnValue({
			allGames: [],
			loading: false,
			initialLoading: false,
			shouldShowLoading: false,
			error: 'Unable to load games',
			isEndOfContent: false,
			visibleItems: {},
			loadMoreGames: mockLoadMoreGames,
			page: 1,
			resetGames: jest.fn(),
		});

		render(<GamesCard onScrollToTop={() => {}} />);

		await waitFor(() => {
			expect(screen.getByText(/unable to load games/i)).toBeInTheDocument();
		});
	});
});
