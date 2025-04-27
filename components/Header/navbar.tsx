import { Menu, User, X, LogOut, Home } from 'lucide-react';
import { Button } from '../UI/button';
import { SearchBar } from '../UI/search-bar';
import { NavLink } from './nav-link';
import { AnimatePresence } from 'framer-motion';
import { MobileMenu } from './nav-mobi';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import { Logo } from './logo';
import Link from 'next/link';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { useState, useRef, useEffect } from 'react';

export interface NavbarProps {
	items: NavItem[];
	logo?: React.ReactNode;
	cartCount?: number;
	onSearch?: (searchTerm: string) => void;
	onCartClick?: () => void;
	onProfileClick?: () => void;
	onMenuToggle?: (isOpen: boolean) => void;
	className?: string;
}
export interface NavItem {
	name: string;
	href: string;
	isActive?: boolean;
}
export const Navbar = ({
	items = [],
	onProfileClick,
	onMenuToggle,
	className = '',
}: NavbarProps) => {
	const {
		isOpen: mobileMenuOpen,
		toggle: toggleMobileMenu,
		menuRef,
	} = useMobileMenu(onMenuToggle);

	const { isSignedIn } = useUser();
	const [showUserMenu, setShowUserMenu] = useState(false);
	const userMenuRef = useRef<HTMLDivElement>(null);

	// Close the user menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setShowUserMenu(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header
			className={`border-b border-gray-200 sticky top-0 bg-white z-50 shadow-sm ${className}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
				{/* Logo and Desktop Navigation */}
				<div className="flex items-center gap-4 md:gap-6">
					<Logo />
					<nav className="hidden md:block">
						<ul className="flex gap-4 lg:gap-6 text-sm">
							{items.map((item) => (
								<NavLink
									key={item.name}
									name={item.name}
									href={item.href}
									isActive={item.isActive}
								/>
							))}
						</ul>
					</nav>
				</div>

				{/* Right side controls */}
				<div className="flex items-center gap-2 sm:gap-4">
					{/* Search - hide on smallest screens */}
					<SearchBar />

					{/* User button with dropdown */}
					<div className="relative" ref={userMenuRef}>
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-700 hover:text-black rounded-full focus:ring-gray-500"
							aria-label="User account"
							onClick={() => setShowUserMenu(!showUserMenu)}
							aria-expanded={showUserMenu}
						>
							<User size={20} />
						</Button>

						{/* User dropdown menu */}
						{showUserMenu && (
							<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
								<div className="py-1" role="menu" aria-orientation="vertical">
									<Link href={isSignedIn ? '/auth/user' : '/auth/sign-in'}>
										<button
											className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											role="menuitem"
										>
											<User size={16} className="mr-2" />
											{isSignedIn ? 'My Profile' : 'Sign In'}
										</button>
									</Link>

									{isSignedIn && (
										<SignOutButton redirectUrl="/">
											<button
												className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
												role="menuitem"
											>
												<LogOut size={16} className="mr-2" />
												Sign Out
											</button>
										</SignOutButton>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Mobile menu toggle */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden text-gray-700 hover:text-black ml-1 rounded-full focus:ring-gray-500"
						aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
						aria-expanded={mobileMenuOpen}
						onClick={toggleMobileMenu}
					>
						{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</Button>
				</div>
			</div>

			{/* Mobile menu drawer */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<MobileMenu
						isOpen={mobileMenuOpen}
						onClose={toggleMobileMenu}
						menuRef={menuRef}
						items={items}
						logo={<Logo />}
					/>
				)}
			</AnimatePresence>
		</header>
	);
};
