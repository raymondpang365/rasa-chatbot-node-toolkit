import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/main.scss';

const SideNavigationBar = () => (
  <nav className={[styles.sideMenu, styles.header].join(' ')}>
    <Link to="/">Home</Link>
    <Link to="/statement">Statement</Link>
    <Link to="/demo/form-element">Form Elements</Link>
  </nav>
);

export default SideNavigationBar;
