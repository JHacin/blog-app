import { mocked } from 'ts-jest/utils';
import axios from 'axios';
import { postFixture, postsFixture } from '../tests/fixtures';
import { API_BASE_URL, ApiEndpoint } from '../constants';
import { getPost, getPosts } from './api';
import { Post } from '../types';

jest.mock('axios');

describe('API services', () => {
  const mockGet = mocked(axios.get);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    beforeAll(() => {
      mockGet.mockResolvedValue({ data: postsFixture });
    });

    it('should call the API with correct params and return an array of posts', async () => {
      const result: Post[] = await getPosts();

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(`${API_BASE_URL}/${ApiEndpoint.Posts}`);

      expect(result).toEqual(postsFixture);
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
