import { render, screen } from '../tests/test_utils';
import Home, { getStaticProps, HomeProps } from './index';
import { postsFixture } from '../tests/fixtures';
import { getText } from '../utils/general';
import { GetStaticPropsResult } from 'next';
import { mocked } from 'ts-jest/utils';
import { PropsWithChildren } from 'react';
import { FetchResult } from '../types';
import { getPosts } from '../services/api';

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: PropsWithChildren<Record<string, never>>) => children,
}));
jest.mock('../services/api');
// eslint-disable-next-line react/display-name
jest.mock('../components/post-preview/post-preview', () => () => <div data-testid="PostPreview" />);

const defaultProps: HomeProps = {
  posts: postsFixture,
  fetchResult: FetchResult.Success,
};

describe('Home', () => {
  it('should render without breaking', () => {
    render(<Home {...defaultProps} />);

    expect(document.title).toEqual(getText('home-title'));
    expect(screen.getByText(getText('home-jumbotron-title'))).toBeInTheDocument();
  });

  it('should display a list of posts if fetching succeeds', () => {
    render(<Home {...defaultProps} />);

    expect(screen.getByText(getText('home-latest-posts'))).toBeInTheDocument();
    expect(screen.queryByText(getText('home-fetch-error'))).not.toBeInTheDocument();
    expect(screen.getAllByTestId('PostPreview')).toHaveLength(postsFixture.length);
  });

  it('should display an error message if fetching fails', () => {
    render(<Home {...defaultProps} fetchResult={FetchResult.Error} />);

    expect(screen.getByText(getText('home-fetch-error'))).toBeInTheDocument();
    expect(screen.queryByText(getText('home-latest-posts'))).not.toBeInTheDocument();
  });

  describe('getStaticProps', () => {
    const mockGetPosts = mocked(getPosts);

    beforeAll(() => {
      mockGetPosts.mockResolvedValue(postsFixture);
    });

    it('should call the API with correct params', async () => {
      await getStaticProps({});

      expect(mockGetPosts).toHaveBeenCalledTimes(1);
    });

    it('should return posts from from the API on success', async () => {
      const result: GetStaticPropsResult<HomeProps> = await getStaticProps({});

      expect(result).toEqual({
        props: {
          posts: postsFixture,
          fetchResult: FetchResult.Success,
        },
      });
    });

    it('should catch & handle any errors', async () => {
      mockGetPosts.mockRejectedValueOnce('error');

      const result: GetStaticPropsResult<HomeProps> = await getStaticProps({});

      expect(result).toEqual({
        props: {
          posts: [],
          fetchResult: FetchResult.Error,
        },
      });
    });
  });
});
