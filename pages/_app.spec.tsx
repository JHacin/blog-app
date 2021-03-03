import App from './_app';
import { AppProps } from 'next/app';
import { Router } from 'next/router';
import { render, screen } from '../tests/test_utils';

describe('App', () => {
  it('should render the provided component', async () => {
    const component: AppProps['Component'] = () => <div data-testid="component" />
    component.getInitialProps = async () => Promise.resolve();

    const baseProps: AppProps = {
      Component: component,
      router: {} as Router,
      pageProps: {},
    };

    render(<App {...baseProps} />);

    const providedComponent = await screen.findByTestId('component');

    expect(providedComponent).toBeInTheDocument();
  });
});
