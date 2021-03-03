import { Navbar, NavbarBrand } from 'reactstrap';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/dist/next-server/lib/router/router';

export const Header = (): JSX.Element => {
  const router: NextRouter = useRouter()

  const goToHomePage = async (): Promise<void> => {
    await router.push('/')
  }

  return (
    <Navbar color="secondary" dark>
      <NavbarBrand onClick={goToHomePage}>Blog App</NavbarBrand>
    </Navbar>
  );
};
