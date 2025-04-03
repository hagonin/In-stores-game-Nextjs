'use client';

import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
	size?: 'small' | 'medium' | 'large';
	color?: string;
	text?: string;
	className?: string;
}

export function LoadingIndicator({
	size = 'medium',
	color = '#000000',
	text,
	className = '',
}: LoadingIndicatorProps) {
	const getSizeConfig = () => {
		switch (size) {
			case 'small':
				return { ball: 'w-2 h-2', gap: 'gap-2' };
			case 'large':
				return { ball: 'w-4 h-4', gap: 'gap-4' };
			default:
				return { ball: 'w-3 h-3', gap: 'gap-3' };
		}
	};

	const { ball, gap } = getSizeConfig();

	const bounceTransition = {
		repeat: Infinity,
		duration: 2.5,
		ease: [0.62, 0.28, 0.23, 0.99],
	};

	const ballVariants = {
		animate: (i: number) => ({
			y: [0, -20, 0],
			backgroundColor: [
				color,
				i === 0 ? color : i === 1 ? '#2A2C2D' : '#404040',
				color,
			],
			transition: {
				...bounceTransition,
				delay: i * 0.4,
			},
		}),
	};

	return (
		<div
			className={`flex flex-col items-center justify-center py-4 ${className}`}
		>
			{text && (
				<div className="text-center mb-2 text-gray-600 text-sm">{text}</div>
			)}
			<div className={`flex items-center ${gap}`}>
				{[0, 1, 2].map((i) => (
					<motion.div
						key={i}
						custom={i}
						variants={ballVariants}
						animate="animate"
						className={`${ball} rounded-full`}
						style={{ backgroundColor: color }}
					/>
				))}
			</div>
		</div>
	);
}
