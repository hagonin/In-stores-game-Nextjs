import axios from 'axios';
import { ApiResponse, Game, GameById } from './types';

// Create an instance of axios with common config for our internal API
const api = axios.create({
	baseURL: '/api',
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
});

export const gameService = {
	async getGames() {
		console.log('gameService: Fetching initial games (page 1)');
		const response = await api.get<ApiResponse<Game>>('/games');
		console.log(
			`gameService: Received ${response.data.results.length} initial games`
		);
		return response.data.results;
	},

	async getGamesByPage(page: number) {
		console.log(`gameService: Fetching games for page ${page}`);
		try {
			const response = await api.get<ApiResponse<Game>>('/games', {
				params: { page },
			});
			console.log(
				`gameService: Received ${response.data.results.length} games for page ${page}`
			);
			return response.data.results;
		} catch (error) {
			console.error(`gameService: Error fetching page ${page}:`, error);
			throw error;
		}
	},

	async getFeaturedGames() {
		const response = await api.get<ApiResponse<Game>>('/games', {
			params: { featured: 'true' },
		});
		return response.data.results;
	},

	async getGameById(id: number | string) {
		const response = await api.get<GameById>(`/games/${id}`);
		return response.data;
	},
};
