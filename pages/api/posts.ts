import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { EXTERNAL_API_BASE_URL, ExternalApiEndpoint } from '../../constants';
import { ApiRouteResponse, Post } from '../../types';
import { getText } from '../../utils/general';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ApiRouteResponse<Post[]>>,
): Promise<void> => {
  try {
    const { data } = await axios.get<Post[]>(
      `${EXTERNAL_API_BASE_URL}/${ExternalApiEndpoint.Posts}`,
    );

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: getText('api-generic-error') });
  }
};
