import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';

const Layout = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;