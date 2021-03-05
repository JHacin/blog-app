import axios from 'axios';
import { ApiEndpoint, Post } from '../types';
import { API_BASE_URL, POSTS_PER_PAGE } from '../constants';
import { getPage } from './pagination';

export interface GetPostsParams {
  page?: number;
}

export interface GetPostsResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    per_page: number;
  };
}

export const getPosts = async ({ page }: GetPostsParams = {}): Promise<GetPostsResponse> => {
  const { data: posts } = await axios.get<Post[]>(`${API_BASE_URL}/${ApiEndpoint.Posts}`);

  if (page) {
    return {
      data: getPage<Post>(posts, { page, perPage: POSTS_PER_PAGE }),
      meta: {
        total: posts.length,
        page,
        per_page: POSTS_PER_PAGE,
      },
    };
  }

  return {
    data: posts,
    meta: {
      total: posts.length,
      page: 1,
      per_page: posts.length,
    },
  };
};

export const getPost = async (id: number): Promise<Post> => {
  const { data } = await axios.get<Post>(`${API_BASE_URL}/${ApiEndpoint.Posts}/${id}`);

  return data;
};
