import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollToTopButton } from '@/components/UI/scroll-to-top-button';
import { useMediaQuery } from '@/hooks/use-media-query';

// Mock the useMediaQuery hook
jest.mock('@/hooks/use-media-query', () => ({
	useMediaQuery: jest.fn(),
}));

// Mock framer-motion components
jest.mock('framer-motion', () => {
	return {
		motion: {
			div: ({ children, ...props }) => (
				<div data-testid="motion-div" {...props}>
					{children}
				</div>
			),
		},
	};
});

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

		// The motion div should be in the document
		const motionDiv = screen.getByTestId('motion-div');
		expect(motionDiv).toBeInTheDocument();
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

		// Find the button
		const button = screen.getByRole('button', { name: /back to top/i });

		// Use className.includes instead of classList.contains for better compatibility
		expect(button.className.includes('sm')).toBeTruthy();
	});

	test('uses default size on desktop devices', () => {
		// Mock desktop view (already set in beforeEach)

		render(<ScrollToTopButton onClick={mockOnClick} />);

		// Find the button
		const button = screen.getByRole('button', { name: /back to top/i });

		// Check that sm size is not in the class name
		expect(button.className.includes('sm')).toBeFalsy();
	});

	test('has proper positioning for button placement', () => {
		const { container } = render(<ScrollToTopButton onClick={mockOnClick} />);

		// Find the motion div wrapper (the fixed positioned element)
		const motionDiv = screen.getByTestId('motion-div');

		// Check classes using includes instead of classList.contains
		expect(motionDiv.className.includes('fixed')).toBeTruthy();
		expect(motionDiv.className.includes('bottom-')).toBeTruthy();
		expect(motionDiv.className.includes('right-')).toBeTruthy();
		expect(motionDiv.className.includes('z-50')).toBeTruthy();
	});
});
