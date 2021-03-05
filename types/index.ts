export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export enum FetchResult {
  Error = 'error',
  Success = 'success'
}

export enum ApiEndpoint {
  Posts = 'posts'
}
