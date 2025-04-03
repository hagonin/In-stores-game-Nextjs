// jest.setup.js
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
	useRouter() {
		return {
			push: jest.fn(),
			replace: jest.fn(),
			prefetch: jest.fn(),
			back: jest.fn(),
		};
	},
	usePathname() {
		return '/';
	},
	useSearchParams() {
		return new URLSearchParams();
	},
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // Deprecated
		removeListener: jest.fn(), // Deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Mock IntersectionObserver if not already mocked in tests
if (!global.IntersectionObserver) {
	global.IntersectionObserver = class IntersectionObserverMock {
		constructor(callback) {
			this.callback = callback;
		}
		observe = jest.fn();
		unobserve = jest.fn();
		disconnect = jest.fn();
	};
}

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
