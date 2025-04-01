import React from 'react';

interface IconButtonProps {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
	className?: string;
	variant?: 'default' | 'outline' | 'ghost';
	size?: 'default' | 'sm' | 'lg';
}

export function IconButton({
	icon,
	label,
	onClick,
	className = '',
	variant = 'default',
	size = 'default',
}: IconButtonProps) {
	const baseStyles =
		'flex items-center justify-center rounded-full focus:outline-none transition-colors';

	const variantStyles = {
		default: 'bg-black text-white hover:bg-gray-800',
		outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
		ghost: 'text-gray-700 hover:bg-gray-100',
	};

	const sizeStyles = {
		sm: 'w-8 h-8',
		default: 'w-10 h-10',
		lg: 'w-12 h-12',
	};

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			onClick={onClick}
			aria-label={label}
			title={label}
		>
			{icon}
		</button>
	);
}
