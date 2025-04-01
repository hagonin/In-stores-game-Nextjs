import { Menu, User, X } from 'lucide-react';
import { Button } from '../UI/button';
import { SearchBar } from '../UI/search-bar';
import { NavLink } from './nav-link';
import { AnimatePresence } from 'framer-motion';
import { MobileMenu } from './nav-mobi';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import { Logo } from './logo';

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

					{/* User button */}
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-700 hover:text-black rounded-full focus:ring-gray-500"
						aria-label="User account"
						onClick={onProfileClick}
					>
						<User size={20} />
					</Button>

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
						logo={<Logo/>}
					/>
				)}
			</AnimatePresence>
		</header>
	);
};
