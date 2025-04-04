import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ScrollToTopButton } from '@/components/UI/scroll-to-top-button';

// Mock framer-motion
jest.mock('framer-motion', () => {
	return {
		motion: {
			div: ({ children, ...props }) => (
				<div data-testid="motion-div" {...props}>
					{children}
				</div>
			),
		},
		AnimatePresence: ({ children }) => <>{children}</>,
	};
});

// Mock window.scrollTo
const originalScrollTo = window.scrollTo;

describe('Scroll Behavior Integration Tests', () => {
	beforeEach(() => {
		// Setup mock for window.scrollTo
		window.scrollTo = jest.fn();

		// Setup mock for window.pageYOffset
		Object.defineProperty(window, 'pageYOffset', {
			writable: true,
			configurable: true,
			value: 0,
		});

		jest.clearAllMocks();
	});

	afterEach(() => {
		// Restore original scrollTo function
		window.scrollTo = originalScrollTo;
	});

	test('scrolls to top when button is clicked', () => {
		// Setup: Mock that user has scrolled down
		Object.defineProperty(window, 'pageYOffset', { value: 1000 });

		// Create a simple scroll to top function to test
		const scrollToTop = jest.fn(() => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});

		render(<ScrollToTopButton onClick={scrollToTop} />);

		// Simulate clicking the button
		const button = screen.getByRole('button', { name: /back to top/i });
		fireEvent.click(button);

		// Verify scrollToTop was called
		expect(scrollToTop).toHaveBeenCalledTimes(1);

		// Verify scrollTo was called with correct parameters
		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: 'smooth',
		});
	});

	test('integration with a custom scroll handler', async () => {
		// Set up a more complex scroll handler with state
		const TestComponent = () => {
			const [isVisible, setIsVisible] = React.useState(false);

			// Effect to handle scroll visibility
			React.useEffect(() => {
				const handleScroll = () => {
					const scrollY = window.pageYOffset;
					setIsVisible(scrollY > 300);
				};

				window.addEventListener('scroll', handleScroll);
				// Trigger initial check
				handleScroll();

				return () => window.removeEventListener('scroll', handleScroll);
			}, []);

			const handleScrollToTop = jest.fn(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
				setIsVisible(false);
			});

			return isVisible ? (
				<ScrollToTopButton onClick={handleScrollToTop} />
			) : null;
		};

		// Initial render - button should be hidden since pageYOffset is 0
		const { rerender } = render(<TestComponent />);

		// Initially, button should not be visible
		expect(
			screen.queryByRole('button', { name: /back to top/i })
		).not.toBeInTheDocument();

		// Simulate scrolling down
		await act(async () => {
			Object.defineProperty(window, 'pageYOffset', { value: 500 });
			// Trigger scroll event
			window.dispatchEvent(new Event('scroll'));
			// Allow state to update
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		// Force a re-render after the state update
		rerender(<TestComponent />);

		// Now button should be visible
		const button = screen.getByRole('button', { name: /back to top/i });
		expect(button).toBeInTheDocument();

		// Click the button
		fireEvent.click(button);

		// Verify window.scrollTo was called
		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: 'smooth',
		});

		// Simulate we've scrolled to the top
		await act(async () => {
			Object.defineProperty(window, 'pageYOffset', { value: 0 });
			window.dispatchEvent(new Event('scroll'));
			// Allow state to update
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		// Force re-render
		rerender(<TestComponent />);

		// Button should disappear
		expect(
			screen.queryByRole('button', { name: /back to top/i })
		).not.toBeInTheDocument();
	});
});
