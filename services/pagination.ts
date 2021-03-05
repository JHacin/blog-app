export interface GetPageOptions {
  page: number;
  perPage: number;
}

export const getPage = <T>(items: T[], { page, perPage }: GetPageOptions): T[] => {
  if (page < 1) {
    return [];
  }

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  return items.slice(startIndex, endIndex);
};
