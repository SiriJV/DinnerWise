import { Outlet } from 'react-router-dom';
// import NavBar from '../components/NavBarOriginal/NavBarOriginal';
import Footer from '../components/Footer/Footer';

export default function RootLayout() {
  return (
    <>
      {/* <NavBar /> */}
      <main>
        <Outlet />
      </main>
      <Footer />{' '}
    </>
  );
}
