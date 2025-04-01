import { Button } from '@/components/UI/button';

interface ErrorMessageProps {
	message: string;
	onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
	return (
		<div className="py-10 text-center">
			<div className="bg-red-50 rounded-lg p-6 mx-auto max-w-md">
				<svg
					className="mx-auto h-12 w-12 text-red-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<h3 className="mt-5 text-lg font-medium text-red-800">
					Something went wrong
				</h3>
				<p className="mt-2 text-sm text-red-700">{message}</p>
				<div className="mt-6">
					<Button
						variant="default"
						onClick={onRetry}
						className="bg-red-600 hover:bg-red-700 text-white"
					>
						Try Again
					</Button>
				</div>
			</div>
		</div>
	);
}
