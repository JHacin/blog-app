import { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from '../components/header/header';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => (
  <>
    <Header />
    <Component {...pageProps} />
  </>
);

export default MyApp;
