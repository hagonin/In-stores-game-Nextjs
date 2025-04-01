'use client';

import Link from 'next/link';

interface NavLinkProps {
	name: string;
	href: string;
	isActive?: boolean;
}

export const NavLink = ({ name, href, isActive = false }: NavLinkProps) => {
	return (
		<li className="relative group">
			<Link
				href={href}
				className={`${
					isActive ? 'font-medium' : 'text-gray-700 hover:text-black'
				} transition-colors duration-200`}
				aria-label={`Navigate to ${name}`}
			>
				{name}
				<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
			</Link>
		</li>
	);
};
