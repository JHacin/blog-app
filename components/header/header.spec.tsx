import { createMockRouter, render, screen, userEvent } from '../../tests/test_utils';
import { Header } from './header';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';

jest.mock('next/router');

describe('Header', () => {
  const mockPush: jest.Mock = jest.fn().mockResolvedValue(true);
  const mockUseRouter = mocked(useRouter);

  beforeAll(() => {
    mockUseRouter.mockReturnValue(
      createMockRouter({
        push: mockPush,
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to the homepage when clicking on the navbar brand', () => {
    render(<Header />);

    userEvent.click(screen.getByText(/blog app/i));

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
