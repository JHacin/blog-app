import Head from 'next/head';
import { GetStaticProps } from 'next';
import { FetchResult, Post } from '../types';
import { getText } from '../utils/general';
import { Col, Container, Jumbotron, Row } from 'reactstrap';
import { getPosts } from '../services/api';
import PostPreview from '../components/post-preview/post-preview';

export interface HomeProps {
  posts: Post[];
  fetchResult: FetchResult;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const posts: Post[] = await getPosts();

    return {
      props: {
        posts,
        fetchResult: FetchResult.Success,
      },
    };
  } catch (err) {
    return {
      props: {
        posts: [],
        fetchResult: FetchResult.Error,
      },
    };
  }
};

const Home = ({ posts, fetchResult }: HomeProps): JSX.Element => (
  <>
    <Head>
      <title>{getText('home-title')}</title>
      <link rel="icon" href="/favicon.ico" />
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

          <Row>
            {posts.map((post: Post) => (
              <Col xs={12} md={6} lg={4} key={post.id} className="d-flex mb-4">
                <PostPreview post={post} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  </>
);

export default Home;
