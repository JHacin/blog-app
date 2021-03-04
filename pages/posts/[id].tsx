import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Container } from 'reactstrap';
import { FetchResult, Post } from '../../types';
import { getText } from '../../utils/general';
import { getPost, getPosts } from '../../services/api';

interface ErrorResult {
  post: null;
  fetchResult: FetchResult.Error;
}

interface SuccessResult {
  post: Post;
  fetchResult: FetchResult.Success;
}

export type PostPageProps = SuccessResult | ErrorResult;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts: Post[] = await getPosts();

  const paths: string[] = posts.map((post: Post) => `/posts/${post.id}`);

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps, { id: string }> = async ({ params }) => {
  try {
    const post: Post = await getPost(Number(params?.id));

    return {
      props: {
        post,
        fetchResult: FetchResult.Success,
      },
    };
  } catch (err) {
    return {
      props: {
        post: null,
        fetchResult: FetchResult.Error,
      },
    };
  }
};

const PostPage = (props: PostPageProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>{props.post?.title ?? getText('error-meta-title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container className="pt-5">
        {props.fetchResult === FetchResult.Error && <div>{getText('post-fetch-error')}</div>}

        {props.fetchResult === FetchResult.Success && (
          <>
            <h1 className="text-center mb-5">{props.post.title}</h1>

            <div className="text-center mb-5">
              <img src={`https://picsum.photos/720/460`} alt="" className="img-fluid" />
            </div>

            <div className="post-body mb-5">{props.post.body}</div>
          </>
        )}
      </Container>
    </>
  );
};

export default PostPage;
