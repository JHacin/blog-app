import { Post } from '../types';

export const postFixture: Post = {
  userId: 1,
  id: 1,
  title: 'title',
  body: 'body',
};

export const postsFixture: Post[] = Array(5)
  .fill(undefined)
  .map<Post>((_, index: number) => ({
    ...postFixture,
    userId: index + 1,
    id: index + 1,
    title: `title-${index + 1}`,
    body: `body-${index + 1}`,
  }));
