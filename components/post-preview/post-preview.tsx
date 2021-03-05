import { Post } from '../../types';
import { Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';
import { NextRouter } from 'next/dist/next-server/lib/router/router';
import { useRouter } from 'next/router';
import Image, { ImageLoaderProps } from 'next/image';

export interface PostPreviewProps {
  post: Post;
}

const imageLoader = ({ src }: ImageLoaderProps): string =>
  `https://picsum.photos/id/${src}/350/200`;

const PostPreview = ({ post }: PostPreviewProps): JSX.Element => {
  const router: NextRouter = useRouter();

  const goToPostDetails = async (): Promise<void> => {
    await router.push(`/posts/${post.id}`);
  };

  return (
    <a className="post-list-card-link-wrapper" href={`/posts/${post.id}`} onClick={goToPostDetails}>
      <Card>
        <CardImg loader={imageLoader} tag={Image} src={`${post.id}`} width={350} height={200} />
        <CardBody>
          <CardTitle tag="h4">{post.title}</CardTitle>
          <CardText>{post.body}</CardText>
        </CardBody>
      </Card>
    </a>
  );
};

export default PostPreview;
