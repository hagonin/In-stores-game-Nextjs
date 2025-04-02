// jest.setup.js
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
	const actual = jest.requireActual('framer-motion');
	return {
		...actual,
		motion: {
			...actual.motion,
			div: ({ children, ...props }) => <div {...props}>{children}</div>,
		},
		AnimatePresence: ({ children }) => <>{children}</>,
	};
});

// Add any other global mocks or setup here
