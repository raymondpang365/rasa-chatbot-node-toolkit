import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/main.scss';

const SideNavigationBar = () => (
  <nav className={[styles.sideMenu, styles.header].join(' ')}>
    <Link to="/">Home</Link>
    <Link to="/user/login">Login</Link>
    <Link to="/feed">Featured</Link>
    <Link to="/matchlist">Event list</Link>
    <Link to="/match">Create an event</Link>
  </nav>
);

export default SideNavigationBar;
