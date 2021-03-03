import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { ApiRouteResponse, Post } from '../../types';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ApiRouteResponse<Post[]>>,
): Promise<void> => {
  try {
    const response = await axios.get<Post[]>(`${API_BASE_URL}/posts`);

    res.status(200).json({ data: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
