'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { ApiError } from '@/components/UI/api-error-boundary';

interface UseDataOptions<T> {
	initialData?: T;
	errorHandler?: (error: ApiError | Error) => void;
	onSuccess?: (data: T) => void;
}

export function useData<T>(url: string, options: UseDataOptions<T> = {}) {
	const [data, setData] = useState<T | undefined>(options.initialData);
	const [error, setError] = useState<ApiError | Error | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await api.get<T>(url);
			setData(response);

			if (options.onSuccess) {
				options.onSuccess(response);
			}
		} catch (err) {
			console.error('Error fetching data:', err);
			const apiError =
				err instanceof Error ? err : new ApiError('Unknown error', 0);

			setError(apiError);

			if (options.errorHandler) {
				options.errorHandler(apiError);
			}
		} finally {
			setIsLoading(false);
		}
	}, [url, options]);

	// Initial fetch
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		data,
		error,
		isLoading,
		refetch: fetchData,
	};
}

export function useMutation<T, K = any>(
	url: string,
	method: 'post' | 'put' | 'patch' | 'delete' = 'post',
	options: UseDataOptions<T> = {}
) {
	const [data, setData] = useState<T | undefined>(options.initialData);
	const [error, setError] = useState<ApiError | Error | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const mutate = useCallback(
		async (payload?: K) => {
			setIsLoading(true);
			setError(null);

			try {
				let response;

				if (method === 'delete' || payload === undefined) {
					response = await api[method]<T>(url);
				} else {
					response = await api[method]<T>(url, payload);
				}

				setData(response);

				if (options.onSuccess) {
					options.onSuccess(response);
				}

				return response;
			} catch (err) {
				console.error(`Error during ${method.toUpperCase()} request:`, err);
				const apiError =
					err instanceof Error ? err : new ApiError('Unknown error', 0);

				setError(apiError);

				if (options.errorHandler) {
					options.errorHandler(apiError);
				}

				throw apiError;
			} finally {
				setIsLoading(false);
			}
		},
		[url, method, options]
	);

	return {
		data,
		error,
		isLoading,
		mutate,
	};
}
