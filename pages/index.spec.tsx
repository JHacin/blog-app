import { render, screen } from '../tests/test_utils';
import Home, { getStaticProps, HomeProps } from './index';
import { postsFixture } from '../tests/fixtures';
import { mocked } from 'ts-jest/utils';
import axios from 'axios';
import { GetStaticPropsResult } from 'next';
import { getText } from '../utils/general';
import { InternalApiEndpoint, INTERNAL_API_BASE_URL } from '../constants';
import { Post } from '../types';

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }) => children,
}));
jest.mock('axios');

const defaultProps: HomeProps = {
  posts: postsFixture,
  fetchResult: 'success',
};

describe('Home', () => {
  it('should render without breaking', () => {
    render(<Home {...defaultProps} />);

    expect(document.title).toEqual(getText('home-title'));
    expect(screen.getByText(getText('home-jumbotron-title'))).toBeInTheDocument()
  });

  it('should display a list of posts if fetching succeeds', () => {
    render(<Home {...defaultProps} />);

    expect(screen.getByText(getText('home-latest-posts'))).toBeInTheDocument();
    expect(screen.queryByText(getText('home-fetch-error'))).not.toBeInTheDocument();

    defaultProps.posts.forEach((post: Post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.body)).toBeInTheDocument();
    });
  });

  it('should display an error message if fetching fails', () => {
    render(<Home {...defaultProps} fetchResult="error" />);

    expect(screen.getByText(getText('home-fetch-error'))).toBeInTheDocument();
    expect(screen.queryByText(getText('home-latest-posts'))).not.toBeInTheDocument();
  });

  describe('getStaticProps', () => {
    const mockGet = mocked(axios.get);

    beforeAll(() => {
      mockGet.mockResolvedValue({ data: { data: postsFixture } });
    });

    it('should call the API route endpoint with correct params', async () => {
      await getStaticProps({});

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(
        `${INTERNAL_API_BASE_URL}/api/${InternalApiEndpoint.Posts}`,
      );
    });

    it('should return posts from /api/posts', async () => {
      const result: GetStaticPropsResult<HomeProps> = await getStaticProps({});

      expect(result).toEqual({
        props: {
          posts: postsFixture,
          fetchResult: 'success',
        },
      });
    });

    it('should catch & handle any errors', async () => {
      mockGet.mockRejectedValueOnce('error');

      const result: GetStaticPropsResult<HomeProps> = await getStaticProps({});

      expect(result).toEqual({
        props: {
          posts: [],
          fetchResult: 'error',
        },
      });
    });
  });
});
