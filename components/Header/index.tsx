'use client';
import { Navbar } from '@/components/Header/navbar';
import { NavItem } from './navbar';

// Define menu items as a constant array
const MENU_ITEMS: NavItem[] = [
	{ name: 'Game Pass', href: '#', isActive: true },
	{ name: 'Games', href: '#', isActive: false },
	{ name: 'Devices', href: '#', isActive: false },
	{ name: 'Play', href: '#', isActive: false },
	{ name: 'Store', href: '#', isActive: false },
];

interface HeaderProps {
	cartCount?: number;
	onSearch?: (searchTerm: string) => void;
	onCartClick?: () => void;
}

export default function Header() {
	return <Navbar items={MENU_ITEMS} />;
}
