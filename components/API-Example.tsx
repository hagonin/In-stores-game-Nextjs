'use client';

import { useState } from 'react';
import { useData, useMutation } from '@/hooks/useData';
import { ApiErrorBoundary } from '@/components/UI/api-error-boundary';
import { Button } from '@/components/UI/button';

// Example component that fetches data with error handling
export function ApiExampleComponent() {
	return (
		<div className="p-6 max-w-5xl mx-auto">
			<h2 className="text-2xl font-bold mb-6">
				API Examples with Error Boundaries
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* GET Example */}
				<ApiErrorBoundary>
					<DataFetchExample />
				</ApiErrorBoundary>

				{/* POST Example */}
				<ApiErrorBoundary>
					<DataMutationExample />
				</ApiErrorBoundary>

				{/* Force Error Example */}
				<ApiErrorBoundary>
					<ForceErrorExample />
				</ApiErrorBoundary>
			</div>
		</div>
	);
}

// Example for GET requests
function DataFetchExample() {
	const { data, isLoading, error, refetch } = useData<{
		title: string;
		body: string;
	}>('https://jsonplaceholder.typicode.com/posts/1');

	return (
		<div className="bg-white p-5 rounded-lg shadow">
			<h3 className="text-lg font-semibold mb-3">GET Request Example</h3>

			{isLoading ? (
				<div className="animate-pulse h-24 bg-gray-100 rounded"></div>
			) : (
				<>
					{data && (
						<div className="mb-4">
							<h4 className="font-medium">{data.title}</h4>
							<p className="text-gray-600 text-sm mt-1">{data.body}</p>
						</div>
					)}

					<Button
						onClick={() => refetch()}
						variant="outline"
						className="text-sm"
					>
						Refresh Data
					</Button>
				</>
			)}
		</div>
	);
}

// Example for POST/PUT/PATCH/DELETE requests
function DataMutationExample() {
	const [postData, setPostData] = useState({
		title: '',
		body: '',
		userId: 1,
	});

	const { mutate, isLoading, data } = useMutation<any>(
		'https://jsonplaceholder.typicode.com/posts'
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await mutate(postData);
	};

	return (
		<div className="bg-white p-5 rounded-lg shadow">
			<h3 className="text-lg font-semibold mb-3">POST Request Example</h3>

			<form onSubmit={handleSubmit} className="space-y-3">
				<div>
					<label className="block text-sm font-medium mb-1">Title</label>
					<input
						type="text"
						value={postData.title}
						onChange={(e) =>
							setPostData((prev) => ({ ...prev, title: e.target.value }))
						}
						className="w-full border rounded p-2 text-sm"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Content</label>
					<textarea
						value={postData.body}
						onChange={(e) =>
							setPostData((prev) => ({ ...prev, body: e.target.value }))
						}
						className="w-full border rounded p-2 text-sm"
						rows={3}
						required
					/>
				</div>

				<Button type="submit" disabled={isLoading} className="w-full">
					{isLoading ? 'Submitting...' : 'Submit Post'}
				</Button>
			</form>

			{data && (
				<div className="mt-4 bg-green-50 p-3 rounded text-sm">
					<p className="font-medium text-green-800">
						Successfully created post!
					</p>
					<p className="text-green-700">Post ID: {data.id}</p>
				</div>
			)}
		</div>
	);
}

// Example that forces an error
function ForceErrorExample() {
	const { mutate, isLoading } = useMutation<any>(
		'https://non-existent-api-url.example/posts'
	);

	const triggerError = () => {
		mutate({ title: 'Test', body: 'This will fail' }).catch((error) => {
			// Error will be caught by ApiErrorBoundary
			console.log('Error caught by boundary');
		});
	};

	return (
		<div className="bg-white p-5 rounded-lg shadow">
			<h3 className="text-lg font-semibold mb-3">Error Demonstration</h3>
			<p className="text-sm text-gray-600 mb-4">
				Click the button below to trigger an API error that will be caught by
				the error boundary.
			</p>

			<Button
				onClick={triggerError}
				variant="default"
				className="w-full bg-red-600 hover:bg-red-700"
				disabled={isLoading}
			>
				{isLoading ? 'Loading...' : 'Trigger Error'}
			</Button>
		</div>
	);
}
