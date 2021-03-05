import { mocked } from 'ts-jest/utils';
import axios from 'axios';
import { postFixture, postsFixture } from '../tests/fixtures';
import { API_BASE_URL, POSTS_PER_PAGE } from '../constants';
import { getPost, getPosts, GetPostsResponse } from './api';
import { ApiEndpoint, Post } from '../types';
import { getPage } from './pagination';

jest.mock('axios');
jest.mock('./pagination');

describe('API services', () => {
  const mockGet = mocked(axios.get);
  const mockPaginator = mocked(getPage);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    beforeAll(() => {
      mockGet.mockResolvedValue({ data: postsFixture });
      mockPaginator.mockReturnValue(postsFixture.slice(10, 20));
    });

    it('should call the API with correct params and return the correct default response', async () => {
      const result: GetPostsResponse = await getPosts();

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(`${API_BASE_URL}/${ApiEndpoint.Posts}`);

      expect(mockPaginator).not.toHaveBeenCalled();

      expect(result).toEqual<GetPostsResponse>({
        data: postsFixture,
        meta: {
          total: postsFixture.length,
          page: 1,
          per_page: postsFixture.length,
        },
      });
    });

    it('should paginate the response if the page parameter is present', async () => {
      const result: GetPostsResponse = await getPosts({ page: 4 });

      expect(mockPaginator).toHaveBeenCalledTimes(1);
      expect(mockPaginator).toHaveBeenCalledWith(postsFixture, {
        page: 4,
        perPage: POSTS_PER_PAGE,
      });

      expect(result).toEqual<GetPostsResponse>({
        data: postsFixture.slice(10, 20),
        meta: {
          total: postsFixture.length,
          page: 4,
          per_page: POSTS_PER_PAGE,
        },
      });
    });
  });

  describe('getPost', () => {
    beforeAll(() => {
      mockGet.mockResolvedValue({ data: postFixture });
    });

    it('should call the API with correct params and return a post', async () => {
      const result: Post = await getPost(42);

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(`${API_BASE_URL}/${ApiEndpoint.Posts}/42`);

      expect(result).toEqual(postFixture);
    });
  });
});
