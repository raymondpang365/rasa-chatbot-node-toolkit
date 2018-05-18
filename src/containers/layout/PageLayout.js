import React from 'react';
import NavigationBar from '../../components/utils/NavigationBar';
import ErrorList from '../../components/utils/ErrorList';
import styles from '../../styles/main.scss';

const PageLayout = ({ children, ...rest }) => (
  <div className="site-container">
    <div className="site-pusher">
      <NavigationBar />
      <div className="site-content">
        <div className="container">
          <ErrorList />
          {children}
        </div>
      </div>
      <div className="site-cache" id="site-cache" />
    </div>
  </div>
);

export default PageLayout;
