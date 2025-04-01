import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { ApiResponse, Game } from '@/lib/types';

const API_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { featured, page = 1 } = req.query;

	try {
		if (featured === 'true') {
			// Handle featured games request
			const response = await axios.get<ApiResponse<Game>>(`${API_URL}/games`, {
				params: {
					key: API_KEY,
					page_size: 20,
					ordering: '-rating',
					exclude_additions: true,
					dates: '2015-01-01,2024-12-31',
					metacritic: '80,100',
					fields:
						'id,name,slug,background_image,rating,released,genres,stores,description',
				},
			});

			// Filter games with high-quality images
			const games = response.data.results;
			let filteredGames = games.filter(
				(game) =>
					game.background_image &&
					!game.background_image.includes('media/games/')
			);

			if (filteredGames.length < 5) {
				filteredGames = games.filter((game) => game.background_image);
			}

			// Apply Fisher-Yates shuffle
			for (let i = filteredGames.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[filteredGames[i], filteredGames[j]] = [
					filteredGames[j],
					filteredGames[i],
				];
			}

			return res.status(200).json({
				...response.data,
				results: filteredGames.slice(0, 5),
			});
		} else {
			// Handle default games request with pagination
			const pageNumber = parseInt(page as string, 10);

			console.log(`API: Fetching games for page ${pageNumber}`);

			const response = await axios.get<ApiResponse<Game>>(`${API_URL}/games`, {
				params: {
					key: API_KEY,
					page: pageNumber,
					page_size: 18,
					ordering: '-rating',
					exclude_additions: true,
					dates: '2015-01-01,2024-12-31',
					metacritic: '70,100',
				},
			});

			if (!response.data || !response.data.results) {
				return res.status(404).json({ error: 'No games found' });
			}

			console.log(
				`API: Fetched ${response.data.results.length} games for page ${pageNumber}`
			);

			return res.status(200).json({
				...response.data,
				page: pageNumber,
			});
		}
	} catch (error) {
		console.error('API error:', error);
		if (axios.isAxiosError(error)) {
			return res
				.status(error.response?.status || 500)
				.json({ error: error.message });
		}
		return res.status(500).json({ error: 'Failed to fetch data' });
	}
}
