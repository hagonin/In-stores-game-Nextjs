'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
	className?: string;
	variant?: 'rectangle' | 'circle' | 'text' | 'rounded';
	width?: string | number;
	height?: string | number;
	animate?: boolean;
}

export function Skeleton({
	className,
	variant = 'rectangle',
	width,
	height,
	animate = true,
}: SkeletonProps) {
	const style = {
		width:
			width !== undefined
				? typeof width === 'number'
					? `${width}px`
					: width
				: undefined,
		height:
			height !== undefined
				? typeof height === 'number'
					? `${height}px`
					: height
				: undefined,
	};

	return (
		<div
			className={cn(
				'bg-gray-200',
				variant === 'circle' && 'rounded-full',
				variant === 'rounded' && 'rounded-lg',
				variant === 'text' && 'rounded h-4',
				animate && 'relative overflow-hidden',
				className
			)}
			style={style}
			aria-hidden="true"
			role="status"
			aria-label="Loading..."
		>
			{animate && (
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-wave" />
			)}
		</div>
	);
}
