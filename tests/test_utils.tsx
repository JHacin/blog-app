import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { FC, ReactElement } from 'react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { NextRouter } from 'next/router';

export const createMockRouter = (props: Partial<NextRouter> = {}): NextRouter =>
  ({
    pasPath: '',
    back: () => undefined,
    basePath: '',
    beforePopState: () => undefined,
    events: {
      on: () => undefined,
      off: () => undefined,
      emit: () => undefined,
    },
    isFallback: false,
    isReady: false,
    pathname: '',
    prefetch: async () => undefined,
    push: async () => true,
    query: {},
    reload: () => undefined,
    replace: async () => true,
    route: '',
    ...props,
  } as NextRouter);

export const nextRouterMock: NextRouter = createMockRouter();

const wrapper: FC = ({ children }) => (
  <RouterContext.Provider value={nextRouterMock}>{children}</RouterContext.Provider>
);

export const render = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): RenderResult =>
  rtlRender(ui, { wrapper, ...options });

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
