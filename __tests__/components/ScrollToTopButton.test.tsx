import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollToTopButton } from '@/components/UI/scroll-to-top-button';
import { useMediaQuery } from '@/hooks/use-media-query';

// Mock the useMediaQuery hook
jest.mock('@/hooks/use-media-query', () => ({
	useMediaQuery: jest.fn(),
}));

describe('ScrollToTopButton Component', () => {
	const mockOnClick = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		// Default to desktop view for most tests
		(useMediaQuery as jest.Mock).mockReturnValue(false);
	});

	test('renders correctly', () => {
		render(<ScrollToTopButton onClick={mockOnClick} />);

		// The button should be in the document
		const button = screen.getByRole('button', { name: /back to top/i });
		expect(button).toBeInTheDocument();

		// The arrow icon should be present (we check for the aria-hidden attribute)
		const arrowIcon = document.querySelector('[aria-hidden="true"]');
		expect(arrowIcon).toBeInTheDocument();
	});

	test('calls onClick when button is clicked', () => {
		render(<ScrollToTopButton onClick={mockOnClick} />);

		const button = screen.getByRole('button', { name: /back to top/i });
		fireEvent.click(button);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	test('uses small size on mobile devices', () => {
		// Mock mobile view
		(useMediaQuery as jest.Mock).mockReturnValue(true);

		render(<ScrollToTopButton onClick={mockOnClick} />);

		// Check for the sm size class on the button
		const button = screen.getByRole('button', { name: /back to top/i });
		expect(button.classList.contains('sm')).toBeTruthy();
	});

	test('uses default size on desktop devices', () => {
		// Mock desktop view (already set in beforeEach)

		render(<ScrollToTopButton onClick={mockOnClick} />);

		// Check that the button doesn't have the sm size class
		const button = screen.getByRole('button', { name: /back to top/i });
		expect(button.classList.contains('sm')).toBeFalsy();
	});

	test('has proper animation properties', () => {
		const { container } = render(<ScrollToTopButton onClick={mockOnClick} />);

		// Find the motion div (the animated container)
		const motionDiv = container.firstChild;
		expect(motionDiv).toBeInTheDocument();

		// Check for animation-related attributes
		expect(motionDiv).toHaveAttribute('style');

		// The style should contain transform-related properties
		const style = (motionDiv as HTMLElement).getAttribute('style') || '';
		expect(style).toMatch(/transform/);
	});

	test('has fixed positioning for proper placement', () => {
		const { container } = render(<ScrollToTopButton onClick={mockOnClick} />);

		// The container should have fixed positioning class
		const motionDiv = container.firstChild as HTMLElement;
		expect(motionDiv.classList.contains('fixed')).toBeTruthy();

		// Check bottom and right positioning classes
		expect(motionDiv.classList.contains('bottom-4')).toBeTruthy();
		expect(motionDiv.classList.contains('right-4')).toBeTruthy();

		// Check responsive classes for larger screens
		expect(motionDiv.classList.contains('sm:bottom-8')).toBeTruthy();
		expect(motionDiv.classList.contains('sm:right-8')).toBeTruthy();
	});
});
