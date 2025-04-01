import React, { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'primary' | 'ghost' | 'outline' | 'secondary';
	size?: 'default' | 'sm' | 'lg' | 'icon';
	isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className = '',
			variant = 'default',
			size = 'default',
			isLoading = false,
			children,
			disabled,
			...props
		},
		ref
	) => {
		// Base styles that apply to all buttons
		const baseStyles =
			'inline-flex items-center justify-center font-medium transition-colors focus:outline-none';

		// Variant styles
		const variantStyles = {
			default: 'bg-blue-600 text-white hover:bg-blue-700',
			primary: 'bg-blue-600 text-white hover:bg-blue-700',
			ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
			outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
			secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
		};

		// Size styles
		const sizeStyles = {
			default: 'h-10 px-4 py-2 text-sm',
			sm: 'h-8 px-3 py-1 text-xs',
			lg: 'h-12 px-6 py-3 text-base',
			icon: 'h-10 w-10 p-2',
		};

		// Combine all classes
		const buttonClasses = `
      ${baseStyles} 
      ${variantStyles[variant]} 
      ${sizeStyles[size]} 
      ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `;

		return (
			<button
				className={buttonClasses}
				disabled={disabled || isLoading}
				ref={ref}
				{...props}
			>
				{isLoading ? (
					<>
						<svg
							className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						{children}
					</>
				) : (
					children
				)}
			</button>
		);
	}
);

Button.displayName = 'Button';

export { Button };
