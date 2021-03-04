interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface SuccessRes<T> {
  data: T;
}

interface ErrorRes {
  error: string;
}

export type ApiRouteResponse<T> = SuccessRes<T> | ErrorRes

export type FetchResult = 'error' | 'success'
