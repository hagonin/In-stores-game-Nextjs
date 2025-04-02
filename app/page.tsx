'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import { ScrollToTopButton } from '@/components/UI/scroll-to-top-button';
import { scrollToTop } from '@/lib/utils';
import { GamesCard } from '@/components/GamesCard';

export default function GameStore() {
	const [showBackToTop, setShowBackToTop] = useState(false);

	// Track scroll position for back to top button
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 500) {
				setShowBackToTop(true);
			} else {
				setShowBackToTop(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div>
			<Header />

			<Banner />

			<main className="max-w-7xl mx-auto px-4 py-6">
				<GamesCard onScrollToTop={scrollToTop} />
			</main>

			{/* Animated Back to Top Button */}
			<AnimatePresence>
				{showBackToTop && <ScrollToTopButton onClick={scrollToTop} />}
			</AnimatePresence>
		</div>
	);
}
