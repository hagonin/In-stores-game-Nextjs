'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { NavItem } from './navbar';


interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
	menuRef: React.RefObject<HTMLDivElement | null>;
	items: NavItem[];
	logo: React.ReactNode;
}

export const MobileMenu = ({
	isOpen,
	onClose,
	menuRef,
	items,
	logo,
}: MobileMenuProps) => {
	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/20 z-40 md:hidden"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Menu panel */}
			<motion.div
				ref={menuRef}
				initial={{ opacity: 0, x: '-100%' }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: '-100%' }}
				transition={{ duration: 0.3, ease: 'easeInOut' }}
				className="fixed inset-y-0 left-0 max-w-[85vw] w-[300px] z-50 bg-white shadow-xl flex flex-col md:hidden"
				role="dialog"
				aria-modal="true"
				aria-label="Mobile menu"
			>
				{/* Header */}
				<div className="p-1 flex justify-between items-center border-b border-gray-200">
					{logo}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden text-gray-700 hover:text-black ml-1 rounded-full focus:ring-gray-500"
						aria-label="Close menu"
						onClick={onClose}
					>
						<X size={23} aria-hidden="true" />
					</Button>
				</div>

				{/* Content */}
				<div className="p-4 flex-1 overflow-y-auto">
					{/* Static Search Bar */}
					<div className="relative mb-6">
						<input
							type="text"
							placeholder="Search games..."
							className="bg-gray-100 rounded-full pl-10 pr-4 py-2 w-full text-sm text-gray-400"
							disabled
						/>
						<Search
							size={18}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							aria-hidden="true"
						/>
					</div>

					{/* Navigation */}
					<nav aria-label="Mobile navigation">
						<ul className="flex flex-col gap-4 text-sm">
							{items.map((item) => (
								<li key={item.name} className="border-b border-gray-100 pb-2">
									<Link
										href={item.href}
										className={`${
											item.isActive ? 'font-medium' : 'text-gray-700'
										} block transition-colors duration-200 hover:text-black text-base w-full`}
										aria-current={item.isActive ? 'page' : undefined}
										onClick={onClose}
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</motion.div>
		</>
	);
};
