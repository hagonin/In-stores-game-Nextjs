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
		const response = await api.get<ApiResponse<Game>>('/games');
		return response.data.results;
	},

	async getGamesByPage(page: number) {
		try {
			const response = await api.get<ApiResponse<Game>>('/games', {
				params: { page },
			});
			return response.data.results;
		} catch (error) {
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
