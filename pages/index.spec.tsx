import { render, screen, userEvent, act } from '../tests/test_utils';
import Home, { getStaticProps, HomeProps } from './index';
import { postsFixture } from '../tests/fixtures';
import { getText } from '../utils/general';
import { GetStaticPropsResult } from 'next';
import { mocked } from 'ts-jest/utils';
import { PropsWithChildren } from 'react';
import { FetchResult, Post } from '../types';
import { getPosts, GetPostsResponse } from '../services/api';
import { getPage } from '../services/pagination';
import { POSTS_PER_PAGE } from '../constants';

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: PropsWithChildren<Record<string, never>>) => children,
}));
jest.mock('../services/api');
// eslint-disable-next-line react/display-name
jest.mock('../components/post-preview/post-preview', () => () => <div data-testid="PostPreview" />);

const initialPosts: Post[] = getPage(postsFixture, { page: 1, perPage: POSTS_PER_PAGE });

const defaultProps: HomeProps = {
  posts: {
    data: initialPosts,
    meta: {
      total: postsFixture.length,
      page: 1,
      per_page: POSTS_PER_PAGE,
    },
  },
  fetchResult: FetchResult.Success,
};

const defaultPostsReponse: GetPostsResponse = {
  data: initialPosts,
  meta: {
    total: postsFixture.length,
    per_page: POSTS_PER_PAGE,
    page: 1,
  },
};

describe('Home', () => {
  const mockGetPosts = mocked(getPosts);

  beforeAll(() => {
    mockGetPosts.mockResolvedValue(defaultPostsReponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without breaking', () => {
    render(<Home {...defaultProps} />);

    expect(document.title).toEqual(getText('home-title'));
    expect(screen.getByText(getText('home-jumbotron-title'))).toBeInTheDocument();
  });

  it('should display a list of posts if fetching succeeds', () => {
    render(<Home {...defaultProps} />);

    expect(screen.getByText(getText('home-latest-posts'))).toBeInTheDocument();
    expect(screen.queryByText(getText('home-fetch-error'))).not.toBeInTheDocument();
    expect(screen.getAllByTestId('PostPreview')).toHaveLength(POSTS_PER_PAGE);
  });

  it('should display an error message if fetching fails', () => {
    render(<Home {...defaultProps} fetchResult={FetchResult.Error} />);

    expect(screen.getByText(getText('home-fetch-error'))).toBeInTheDocument();
    expect(screen.queryByText(getText('home-latest-posts'))).not.toBeInTheDocument();
  });

  it('should load the next page of posts when the Load more button is clicked', async () => {
    render(<Home {...defaultProps} />);

    expect(screen.getAllByTestId('PostPreview')).toHaveLength(POSTS_PER_PAGE);

    mockGetPosts.mockResolvedValueOnce({
      ...defaultPostsReponse,
      data: getPage(postsFixture, { page: 2, perPage: POSTS_PER_PAGE }),
      meta: {
        ...defaultPostsReponse.meta,
        page: 2,
      },
    });

    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: getText('load-more') }));
    });

    expect(mockGetPosts).toHaveBeenCalledTimes(1);
    expect(mockGetPosts).toHaveBeenNthCalledWith(1, { page: 2 });
    expect(screen.queryByText(getText('load-more-error'))).not.toBeInTheDocument();

    expect(screen.getAllByTestId('PostPreview')).toHaveLength(POSTS_PER_PAGE * 2);

    mockGetPosts.mockResolvedValueOnce({
      ...defaultPostsReponse,
      data: getPage(postsFixture, { page: 3, perPage: POSTS_PER_PAGE }),
      meta: {
        ...defaultPostsReponse.meta,
        page: 3,
      },
    });

    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: getText('load-more') }));
    });

    expect(mockGetPosts).toHaveBeenCalledTimes(2);
    expect(mockGetPosts).toHaveBeenNthCalledWith(2, { page: 3 });
  });

  it('should handle errors when fetching next page fails', async () => {
    render(<Home {...defaultProps} />);

    expect(screen.getAllByTestId('PostPreview')).toHaveLength(POSTS_PER_PAGE);

    mockGetPosts.mockRejectedValueOnce('error');

    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: getText('load-more') }));
    });

    expect(mockGetPosts).toHaveBeenCalledTimes(1);

    expect(screen.getByText(getText('load-more-error'))).toBeInTheDocument();
    expect(screen.getAllByTestId('PostPreview')).toHaveLength(POSTS_PER_PAGE);
  });

  it('should hide the Load more button if there are no more pages', async () => {
    render(
      <Home
        {...defaultProps}
        posts={{
          ...defaultProps.posts,
          meta: {
            ...defaultProps.posts.meta,
            page: 10,
            per_page: POSTS_PER_PAGE,
            total: 5,
          },
        }}
      />,
    );

    expect(screen.queryByRole('button', { name: getText('load-more') })).not.toBeInTheDocument();

    render(
      <Home
        {...defaultProps}
        posts={{
          ...defaultProps.posts,
          meta: {
            ...defaultProps.posts.meta,
            page: 10,
            per_page: POSTS_PER_PAGE,
            total: 50000,
          },
        }}
      />,
    );

    expect(screen.getByRole('button', { name: getText('load-more') })).toBeInTheDocument();

    mockGetPosts.mockResolvedValueOnce({
      data: [],
      meta: {
        total: 1,
        page: 5,
        per_page: 1
      }
    })

    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: getText('load-more') }));
    });

    expect(screen.queryByRole('button', { name: getText('load-more') })).not.toBeInTheDocument();
  });
});

describe('getStaticProps', () => {
  const mockGetPosts = mocked(getPosts);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the API with correct params', async () => {
    await getStaticProps({});

    expect(mockGetPosts).toHaveBeenCalledTimes(1);
    expect(mockGetPosts).toHaveBeenCalledWith({ page: 1 });
  });

  it('should return posts from from the API on success', async () => {
    const result: GetStaticPropsResult<HomeProps> = await getStaticProps({});

    expect(result).toEqual({
      props: {
        posts: {
          data: initialPosts,
          meta: {
            total: postsFixture.length,
            page: 1,
            per_page: POSTS_PER_PAGE,
          },
        },
        fetchResult: FetchResult.Success,
      },
    });
  });

  it('should catch & handle any errors', async () => {
    mockGetPosts.mockRejectedValueOnce('error');

    const result: GetStaticPropsResult<HomeProps> = await getStaticProps({});

    expect(result).toEqual({
      props: {
        posts: {
          data: [],
          meta: {
            total: 0,
            per_page: POSTS_PER_PAGE,
            page: 1,
          },
        },
        fetchResult: FetchResult.Error,
      },
    });
  });
});
