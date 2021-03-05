import { getPage } from './pagination';

// 1-95
const items: number[] = Array(95)
  .fill(undefined)
  .map<number>((_, index: number) => index + 1);

describe('getPage', () => {
  it('should return one page of items', () => {
    expect(
      getPage<number>(items, { page: 1, perPage: 10 }),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    expect(
      getPage<number>(items, { page: 2, perPage: 10 }),
    ).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

    expect(
      getPage<number>(items, { page: 9, perPage: 10 }),
    ).toEqual([81, 82, 83, 84, 85, 86, 87, 88, 89, 90]);

    expect(
      getPage<number>(items, { page: 10, perPage: 10 }),
    ).toEqual([91, 92, 93, 94, 95]);
  });

  it('should return an empty array if the page parameter goes over the total count', () => {
    expect(
      getPage<number>(items, { page: 99, perPage: 10 }),
    ).toEqual([]);
  });

  it('should return an empty array if page is less than 1', () => {
    expect(
      getPage<number>(items, { page: -1, perPage: 10 }),
    ).toEqual([]);
  });
});
