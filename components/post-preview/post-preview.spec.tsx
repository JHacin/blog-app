import { createMockRouter, render, screen, userEvent } from '../../tests/test_utils';
import PostPreview from './post-preview';
import { postFixture } from '../../tests/fixtures';
import { mocked } from 'ts-jest/utils';
import { useRouter } from 'next/router';

jest.mock('next/router');

describe('PostPreview', () => {
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

  it('should render the component correctly', () => {
    render(<PostPreview post={postFixture} />);

    expect(screen.getByRole('heading', { name: postFixture.title })).toBeInTheDocument();
    expect(screen.getByText(postFixture.body)).toBeInTheDocument();
  });

  it('should navigate to the post page when clicked', () => {
    render(<PostPreview post={postFixture} />);

    userEvent.click(screen.getByRole('link'));

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/posts/${postFixture.id}`);
  });
});
