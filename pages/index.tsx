import Head from 'next/head';
import { GetStaticProps } from 'next';
import { FetchResult, Post } from '../types';
import axios from 'axios';
import { getText } from '../utils/general';
import { ApiEndpoint, API_BASE_URL } from '../constants';
import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  Jumbotron,
  Row,
} from 'reactstrap';

export interface HomeProps {
  posts: Post[];
  fetchResult: FetchResult;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const { data } = await axios.get<Post[]>(
      `${API_BASE_URL}/${ApiEndpoint.Posts}`,
    );

    return {
      props: {
        posts: data,
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

const Home = ({ posts, fetchResult }: HomeProps): JSX.Element => {
  return (
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
              {posts.map((post: Post, index: number) => (
                <Col xs={12} md={6} lg={4} key={post.id} className="d-flex mb-4">
                  <Card>
                    <CardImg src={`https://picsum.photos/${350 + index}/${200 + index}`} />
                    <CardBody>
                      <CardTitle tag="h4">{post.title}</CardTitle>
                      <CardText>{post.body}</CardText>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </>
  );
};

export default Home;
