import { useState, useEffect, useRef } from 'react';

export function useMobileMenu(onMenuToggle?: (isOpen: boolean) => void) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const toggle = () => {
		const next = !isOpen;
		setIsOpen(next);
		onMenuToggle?.(next);
	};

	// Close menu when pressing escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) toggle();
		};
		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen]);

	// Trap focus within modal when open
	useEffect(() => {
		if (!isOpen || !menuRef.current) return;

		// Focus first focusable element
		const focusable = menuRef.current.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		if (focusable.length > 0) {
			(focusable[0] as HTMLElement).focus();
		}
	}, [isOpen]);

	return { isOpen, toggle, menuRef };
}
