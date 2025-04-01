import { AlertCircle } from 'lucide-react';

interface ImageErrorProps {
	message?: string;
	className?: string;
}

export const ImageError: React.FC<ImageErrorProps> = ({
	message = 'Image could not be loaded',
	className = '',
}) => {
	return (
		<div
			className={`w-full h-full flex flex-col items-center justify-center p-4 ${className}`}
		>
			<AlertCircle size={32} className="text-gray-400 mb-2" />
			<p className="text-gray-500 text-sm text-center">{message}</p>
		</div>
	);
};
