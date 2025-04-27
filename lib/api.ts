import { ApiError } from '@/components/UI/api-error-boundary';

/**
 * Wrapper for fetch API with built-in error handling
 */
export async function fetchWithErrorHandling<T>(
	url: string,
	options?: RequestInit
): Promise<T> {
	try {
		const response = await fetch(url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
		});

		if (!response.ok) {
			throw new ApiError(
				response.statusText ||
					`API request failed with status ${response.status}`,
				response.status
			);
		}

		// For 204 No Content
		if (response.status === 204) {
			return {} as T;
		}

		// For all other successful responses
		return await response.json();
	} catch (error) {
		// Re-throw ApiError instances
		if (error instanceof ApiError) {
			throw error;
		}

		// Wrap other errors (like network errors) in ApiError
		if (error instanceof Error) {
			throw new ApiError(error.message, 0);
		}

		// Handle unknown errors
		throw new ApiError('An unknown error occurred', 0);
	}
}

/**
 * Helper functions for common API operations
 */
export const api = {
	get: <T>(url: string, options?: RequestInit) =>
		fetchWithErrorHandling<T>(url, { ...options, method: 'GET' }),

	post: <T>(url: string, data: any, options?: RequestInit) =>
		fetchWithErrorHandling<T>(url, {
			...options,
			method: 'POST',
			body: JSON.stringify(data),
		}),

	put: <T>(url: string, data: any, options?: RequestInit) =>
		fetchWithErrorHandling<T>(url, {
			...options,
			method: 'PUT',
			body: JSON.stringify(data),
		}),

	patch: <T>(url: string, data: any, options?: RequestInit) =>
		fetchWithErrorHandling<T>(url, {
			...options,
			method: 'PATCH',
			body: JSON.stringify(data),
		}),

	delete: <T>(url: string, options?: RequestInit) =>
		fetchWithErrorHandling<T>(url, { ...options, method: 'DELETE' }),
};
