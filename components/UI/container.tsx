import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
	children: ReactNode;
	className?: string;
	fixedHeight?: 'small' | 'medium' | 'large' | 'banner';
}

export function Container({
	children,
	className,
	fixedHeight,
}: ContainerProps) {
	const heightClasses = {
		small: 'h-[225px] sm:h-[250px] md:h-[275px] lg:h-[300px]',
		medium: 'h-[275px] sm:h-[300px] md:h-[325px] lg:h-[350px]',
		large: 'h-[325px] sm:h-[350px] md:h-[400px] lg:h-[450px]',
		banner: 'h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]',
	};

	return (
		<div
			className={cn(
				'w-full',
				fixedHeight && heightClasses[fixedHeight],
				className
			)}
		>
			{children}
		</div>
	);
}
