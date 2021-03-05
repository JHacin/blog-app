import Head from 'next/head';
import { GetStaticProps } from 'next';
import { FetchResult, Post } from '../types';
import { getText } from '../utils/general';
import { Button, Col, Container, Jumbotron, Row } from 'reactstrap';
import { getPosts, GetPostsResponse } from '../services/api';
import PostPreview from '../components/post-preview/post-preview';
import { useRef, useState } from 'react';
import { POSTS_PER_PAGE } from '../constants';

export interface HomeProps {
  posts: GetPostsResponse;
  fetchResult: FetchResult;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const baseConfig = {
    revalidate: 10 * 60 * 60,
  }

  try {
    const posts: GetPostsResponse = await getPosts({ page: 1 });

    return {
      ...baseConfig,
      props: {
        posts,
        fetchResult: FetchResult.Success,
      },
    };
  } catch (err) {
    return {
      ...baseConfig,
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
    };
  }
};

const Home = ({ posts: initialPosts, fetchResult }: HomeProps): JSX.Element => {
  const meta = useRef<GetPostsResponse['meta']>(initialPosts.meta);
  const [posts, setPosts] = useState<Post[]>(initialPosts.data);
  const [isNextPageFetchError, setIsNextPageFetchError] = useState<boolean>(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const isNextPageAvailable: boolean =
    meta.current.page < meta.current.total / meta.current.per_page;

  const fetchNextPage = async (): Promise<void> => {
    setIsNextPageFetchError(false);
    setIsFetchingNextPage(true);

    try {
      const nextPosts: GetPostsResponse = await getPosts({ page: meta.current.page + 1 });

      setPosts([...posts, ...nextPosts.data]);
      meta.current = nextPosts.meta;
    } catch (err) {
      setIsNextPageFetchError(true);
    }

    setIsFetchingNextPage(false);
  };

  return (
    <>
      <Head>
        <title>{getText('home-title')}</title>
      </Head>

      <Jumbotron className="mb-5">
        <Container>
          <h1 className="display-3">{getText('home-jumbotron-title')}</h1>
          <p className="lead">{getText('home-jumbotron-subtitle')}</p>
        </Container>
      </Jumbotron>

      <Container className="mb-5">
        {fetchResult === 'error' && <div>{getText('home-fetch-error')}</div>}

        {fetchResult === 'success' && (
          <div>
            <h2 className="font-weight-bold mb-4">{getText('home-latest-posts')}</h2>

            <Row className="mb-4">
              {posts.map((post: Post) => (
                <Col xs={12} md={6} lg={4} key={post.id} className="d-flex mb-4">
                  <PostPreview post={post} />
                </Col>
              ))}
            </Row>

            {isNextPageAvailable && (
              <div className="text-center">
                <Button
                  color="primary"
                  onClick={fetchNextPage}
                  className="mb-1"
                  disabled={isFetchingNextPage}
                >
                  {getText(isFetchingNextPage ? 'load-more-loading' : 'load-more')}
                </Button>
                {isNextPageFetchError && <div>{getText('load-more-error')}</div>}
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  );
};

export default Home;
