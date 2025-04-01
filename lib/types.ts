export interface Game {
	id: string;
	name: string;
	slug: string;
	background_image: string;
	short_screenshots?: {
		id: number;
		image: string;
	}[];
	description?: string;
	stores?: {
		id: number;
		name: string;
		slug: string;
	};
	genres?: {
		id: number;
		name: string;
		slug: string;
	}[];
	metacritic?: number;
	rating?: number;
	released?: string;
	tags?: {
		id: number;
		name: string;
		slug: string;
		image_background: string;
	};
}

export interface GameById {
	id: string;
	name?: string;
	slug?: string;
	description?: string;
	background_image?: string;
	rating?: number;
	title?: string;
	image?: string;
	stores?: string[];
	badge?: {
		type: string;
		text: string;
	};
}

export interface ApiResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}

export interface Banner {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	mobileImage?: string;
	genres?: string;
}
