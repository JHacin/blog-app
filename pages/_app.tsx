import { AppProps } from 'next/app';
import { Header } from '../components/header/header';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => (
  <>
    <Header />
    <Component {...pageProps} />
  </>
);

export default MyApp;
