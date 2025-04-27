import { ClerkProvider } from '@clerk/nextjs';
import '@/app/globals.css';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from '@/components/UI/error-boundary';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ClerkProvider {...pageProps}>
			<ErrorBoundary>
				<Component {...pageProps} />
			</ErrorBoundary>
		</ClerkProvider>
	);
}
