import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar';
import { Footer } from '../Footer/Footer';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 