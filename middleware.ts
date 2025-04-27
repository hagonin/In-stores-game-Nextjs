import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Create middleware that combines Clerk's middleware with custom redirect logic
const publicPaths = ['/auth/sign-in(.*)', '/auth/sign-up(.*)', '/'];
const isPublicPath = createRouteMatcher(publicPaths);

// Main middleware export
export default clerkMiddleware(async (auth, req) => {
	// Redirect old routes to new ones
	const url = req.nextUrl;
	const path = url.pathname;

	// Redirect old routes to new ones
	if (path === '/sign-in') {
		url.pathname = '/auth/sign-in';
		return NextResponse.redirect(url);
	}

	if (path === '/sign-up') {
		url.pathname = '/auth/sign-up';
		return NextResponse.redirect(url);
	}

	if (path === '/user') {
		url.pathname = '/auth/user';
		return NextResponse.redirect(url);
	}

	// Protect non-public routes
	if (!isPublicPath(req)) {
		const session = await auth();
		if (!session.userId) {
			const signInUrl = new URL('/auth/sign-in', req.url);
			return NextResponse.redirect(signInUrl);
		}
	}
});

export const config = {
	matcher: ['/((?!.*\\..*).*)', '/', '/(api|trpc)(.*)'],
};
