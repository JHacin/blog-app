import axios from 'axios';
import { Post } from '../types';
import { API_BASE_URL, ApiEndpoint } from '../constants';

export const getPosts = async (): Promise<Post[]> => {
  const { data } = await axios.get<Post[]>(`${API_BASE_URL}/${ApiEndpoint.Posts}`);

  return data;
};

export const getPost = async (id: number): Promise<Post> => {
  const { data } = await axios.get<Post>(`${API_BASE_URL}/${ApiEndpoint.Posts}/${id}`);

  return data;
};
