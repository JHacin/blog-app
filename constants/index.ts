export const INTERNAL_API_BASE_URL: string = process.env.NEXT_PUBLIC_INTERNAL_API_BASE_URL;
export const EXTERNAL_API_BASE_URL: string = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;

export enum ExternalApiEndpoint {
  Posts = 'posts'
}

export enum InternalApiEndpoint {
  Posts = 'posts'
}
