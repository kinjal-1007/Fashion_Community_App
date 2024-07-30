import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
const Navbar=()=>{
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
            <Link className="nav-link" to="/signup">Signup</Link>
            <Link className="nav-link" to="/login">Log in</Link>
            <Link className="nav-link logout" to="/logout">Log out</Link>
          </div>
        </div>
        </div>
      </nav>
    )
};

export default Navbar;