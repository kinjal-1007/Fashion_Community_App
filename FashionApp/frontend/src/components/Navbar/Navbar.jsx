import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
const Navbar=()=>{
  const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies for session management
            });
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                  // Use the redirect URL from the server response
                  localStorage.setItem('flashMessage', data.message);
                  navigate(data.redirectUrl);
              } else {
                  console.error('Logout failed:', data.message);
              }
          } else {
              console.error('Logout failed with status:', response.status);
          }
      }  catch (error) {
            console.error('Error during logout:', error);
        }
    };
    return (
        <nav class="navbar navbar-expand-md bg-body-tertiary sticky-top">
        <div class="container-fluid">
            <a class="navbar-brand ms-2" href="/list"><i class="fa-brands fa-connectdevelop"></i></a>
            <div class="website-name">Hype</div>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse ms-2" id="navbarNav">
          <div className="navbar-nav">
            <Link className="nav-link" to="/list">Explore</Link>
          </div>
          <form className="d-flex mx-auto" role="search">
            <input className="form-control me- search-bar" type="search" placeholder="Search Posts" aria-label="Search" />
            <button className="btn btn-outline-success search-btn" type="submit">Search</button>
          </form>
          <div className="navbar-nav ms-auto">
            <Link className="nav-link generator" to="/imageAI">Generate using FashionVerse<i class="fa-brands fa-gripfire"></i></Link>
            <Link className="nav-link" to="/signup">Sign up</Link>
            <Link className="nav-link" to="/login">Log in</Link>
            <button className="nav-link btn btn-link logout" onClick={handleLogout}>Log out</button>
          </div>
        </div>
        </div>
      </nav>
    )
};

export default Navbar;