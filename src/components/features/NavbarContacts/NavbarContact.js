import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from "./NavbarContact.module.css"; 

const NavbarContact = () => {
  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>
        <NavLink to="/" className={classes.navLink}>Pitbull NFTS</NavLink>
      </div>
      <ul className={classes.navList}>
        <li className={classes.navItem}>
          <NavLink to="/about" className={classes.navLink} >About</NavLink>
        </li>
        <li className={classes.navItem}>
          <NavLink to="/contact" className={classes.navLink} >Contact Us</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarContact;
