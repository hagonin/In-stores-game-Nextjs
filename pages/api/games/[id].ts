import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { GameById } from '@/lib/types';

const API_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;

	if (!id || Array.isArray(id)) {
		return res.status(400).json({ error: 'Invalid game ID' });
	}

	try {
		const response = await axios.get<GameById>(`${API_URL}/games/${id}`, {
			params: { key: API_KEY },
		});

		return res.status(200).json(response.data);
	} catch (error) {
		console.error(`Error fetching game ${id}:`, error);
		return res.status(500).json({ error: 'Failed to fetch game details' });
	}
}
