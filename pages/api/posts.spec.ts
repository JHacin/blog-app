import handler from './posts';
import { testApiHandler } from 'next-test-api-route-handler';
import axios from 'axios';
import { mocked } from 'ts-jest/utils';
import { API_BASE_URL } from '../../constants';
import { ApiRouteResponse, Post } from '../../types';
import { postsFixture } from '../../tests/fixtures';

jest.mock('axios');

describe('posts API route', () => {
  const mockGet = mocked(axios.get);

  beforeAll(() => {
    mockGet.mockResolvedValue({ data: postsFixture });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testApi = async (assertionCallback: (res: Response) => Promise<void>): Promise<void> => {
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res: Response = await fetch();

        await assertionCallback(res);
      },
    });
  };

  it('should call the api with correct params', async () => {
    await testApi(async () => {
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(`${API_BASE_URL}/posts`);
    });
  });

  it('should return a list of posts', async () => {
    await testApi(async (res: Response) => {
      expect(await res.json()).toEqual<ApiRouteResponse<Post[]>>({ data: postsFixture });
    });
  });

  it('should handle errors', async () => {
    mockGet.mockRejectedValueOnce('error');

    await testApi(async (res: Response) => {
      expect(await res.json()).toEqual<ApiRouteResponse<Post[]>>({ error: 'Something went wrong' });
    });
  });
});
