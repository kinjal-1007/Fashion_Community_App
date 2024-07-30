import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx'; 
import Footer from '../Footer/Footer.jsx';
import './Layout.css';
const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className='box'>
        <Outlet /> 
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;
