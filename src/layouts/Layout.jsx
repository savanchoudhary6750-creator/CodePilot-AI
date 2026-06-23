import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';
import { setUnauthorizedHandler } from '../services/api';
import { useAuthContext } from '../state/context/AuthContext';

const Layout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await logout();
      navigate('/login');
    });
  }, [logout, navigate]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;