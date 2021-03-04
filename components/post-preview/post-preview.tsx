import { Post } from '../../types';
import { Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';
import { NextRouter } from 'next/dist/next-server/lib/router/router';
import { useRouter } from 'next/router';

export interface PostPreviewProps {
  post: Post;
}

const PostPreview = ({ post }: PostPreviewProps): JSX.Element => {
  const router: NextRouter = useRouter();

  const goToPostDetails = async (): Promise<void> => {
    await router.push(`/posts/${post.id}`);
  };

  return (
    <a className="post-list-card-link-wrapper" href={`/posts/${post.id}`} onClick={goToPostDetails}>
      <Card>
        <CardImg src={`https://picsum.photos/${350 + post.id}/${200 + post.id}`} />
        <CardBody>
          <CardTitle tag="h4">{post.title}</CardTitle>
          <CardText>{post.body}</CardText>
        </CardBody>
      </Card>
    </a>
  );
};

export default PostPreview;
