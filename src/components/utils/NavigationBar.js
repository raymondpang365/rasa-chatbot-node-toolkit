import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from '../../styles/main.scss';

const Dropdown = require('react-simple-dropdown');

class NavigationBar extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { withSideBar: false };
    this.toggleButtonStyle = this.toggleButtonStyle.bind(this);
  }


  componentDidMount() {
    console.log(this.props);
    document.body.classList.toggle(`${styles.withSideMenu}`, this.state.withSideBar);
  }

  toggleSideBar(){
    this.setState({ withSideBar: !this.state.withSideBar });
    document.body.classList.toggle(`${styles.withSideMenu}`, this.state.withSideBar);
  };

  toggleButtonStyle(pathname){
    console.log('navBar props:');
    console.log(this.props);
    if (this.props.router.location.pathname === pathname){
      return styles.menu__anchor__chosen;
    }
    else {
      return styles.menu__anchor;
    }
  }


  render() {

    const { isAuth, user } = this.props;
    console.log(`isAuth:${isAuth}`);
    console.log(`user.avatarURL:${user.avatarURL}`);
    console.log('bibibo');

    return(
      <header className={styles.header}>
        <button onClick={this.toggleSideBar.bind(this)} className={styles.header__icon} id={styles.header__icon} />
        <Link className={styles.header__logo} to="/" >
          <span role="img" aria-label="baby">🚗</span>
        </Link>
        <nav className={styles.menuLeft}>
          <Link className={this.toggleButtonStyle('/')} to="/">Home</Link>
        </nav>
        <nav className={styles.menuRight}>
          {!isAuth &&
          <Link className={styles.menu__anchor__green} to="/user/register">Sign up for Beta</Link>
          }
          {!isAuth &&
            <Link className={this.toggleButtonStyle('/user/login')} to="/user/login">Login</Link>
          }
          {isAuth &&
            <div className={styles.dropdown__button}>
              {user.avatarURL ? (
                <img
                  alt="me"
                  style={{ height: 30 }}
                  src={user.avatarURL}
                  rounded
                />
              ) : <text id={user.name || user.email} />}
              <div className={styles.dropdown__content}>
                <a href="#">Setting</a>
                <a href="#">Security</a>
                <Link className={styles.menu__anchor} to="/user/logout">Logout</Link>
              </div>
            </div>
          }
        </nav>

      </header>

    );
  }
};

export default connect(({ router, cookies: { token, user } }) => ({
  router,
  isAuth: !!token,
  user: user || {},
}), null, null, {
  pure: false,
})(NavigationBar);
