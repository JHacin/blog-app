declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_INTERNAL_API_BASE_URL: string;
      NEXT_PUBLIC_EXTERNAL_API_BASE_URL: string;
    }
  }
}

export {};
