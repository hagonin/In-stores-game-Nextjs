'use client';

import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { IconButton } from './icon-button';

interface ScrollToTopButtonProps {
	onClick: () => void;
}

export function ScrollToTopButton({ onClick }: ScrollToTopButtonProps) {
	const isMobile = useMediaQuery('(max-width: 640px)');

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50"
		>
			<IconButton
				variant="default"
				size={isMobile ? 'sm' : 'default'}
				icon={
					<ArrowUp size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
				}
				label="Back to top"
				onClick={onClick}
				className="bg-black text-white hover:bg-gray-800 cursor-pointer"
			/>
		</motion.div>
	);
}
