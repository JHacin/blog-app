import PostPage, { getStaticPaths, getStaticProps, PostPageProps } from '../../../pages/posts/[id]';
import { postFixture, postsFixture } from '../../fixtures';
import { render, screen } from '../../test_utils';
import { getText } from '../../../utils/general';
import { FetchResult, Post } from '../../../types';
import { PropsWithChildren } from 'react';
import { mocked } from 'ts-jest/utils';
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { getPost, getPosts } from '../../../services/api';
import { POSTS_PER_PAGE } from '../../../constants';

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: PropsWithChildren<Record<string, never>>) => children,
}));
jest.mock('../../services/api');

const defaultProps: PostPageProps = {
  post: postFixture,
  fetchResult: FetchResult.Success,
};

const defaultContext: GetStaticPropsContext<{ id: string }> = { params: { id: '42' } };

describe('PostPage', () => {
  it('should render without breaking', () => {
    render(<PostPage {...defaultProps} />);

    expect(document.title).toEqual(defaultProps.post.title);
  });

  it('should display the post if fetching succeeds', () => {
    render(<PostPage {...defaultProps} />);

    expect(screen.getByRole('heading', { name: defaultProps.post.title })).toBeInTheDocument();
    expect(screen.getByText(defaultProps.post.body)).toBeInTheDocument();
    expect(screen.queryByText(getText('post-fetch-error'))).not.toBeInTheDocument();
  });

  it('should display an error message if fetching fails', () => {
    render(<PostPage {...defaultProps} fetchResult={FetchResult.Error} post={null} />);

    expect(screen.getByText(getText('post-fetch-error'))).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: defaultProps.post.title }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(defaultProps.post.body)).not.toBeInTheDocument();
  });

  describe('getStaticPaths', () => {
    const mockGetPosts = mocked(getPosts);

    beforeAll(() => {
      mockGetPosts.mockResolvedValue({
        data: postsFixture,
        meta: {
          total: postsFixture.length,
          page: 1,
          per_page: POSTS_PER_PAGE,
        },
      });
    });

    it('should fetch the list of all posts and return the right static paths definition', async () => {
      const result: GetStaticPathsResult = await getStaticPaths({});

      expect(mockGetPosts).toHaveBeenCalledTimes(1);

      expect(result).toEqual<GetStaticPathsResult>({
        paths: postsFixture.map((post: Post) => `/posts/${post.id}`),
        fallback: true,
      });
    });
  });

  describe('getStaticProps', () => {
    const mockGetPost = mocked(getPost);

    beforeAll(() => {
      mockGetPost.mockResolvedValue(postFixture);
    });

    it('should call the API service with correct params', async () => {
      await getStaticProps(defaultContext);

      expect(mockGetPost).toHaveBeenCalledTimes(1);
      expect(mockGetPost).toHaveBeenCalledWith(Number(defaultContext.params?.id));
    });

    it('should return the posts when fetching succeeds', async () => {
      const result: GetStaticPropsResult<PostPageProps> = await getStaticProps(defaultContext);

      expect(result).toEqual({
        props: {
          post: postFixture,
          fetchResult: FetchResult.Success,
        },
      });
    });

    it('should catch & handle any errors', async () => {
      mockGetPost.mockRejectedValueOnce('error');

      const result: GetStaticPropsResult<PostPageProps> = await getStaticProps(defaultContext);

      expect(result).toEqual({
        props: {
          post: null,
          fetchResult: FetchResult.Error,
        },
      });
    });
  });
});
