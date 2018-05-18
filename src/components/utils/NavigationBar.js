import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from '../../styles/main.scss';

class NavigationBar extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { withSideBar: false };
  }


  componentDidMount() {
    document.body.classList.toggle(`${styles.withSideMenu}`, this.state.withSideBar);
  }

  toggleSideBar(){
    this.setState({ withSideBar: !this.state.withSideBar });
    document.body.classList.toggle(`${styles.withSideMenu}`, this.state.withSideBar);
};


  render() {

    const { isAuth } = this.props;
    console.log(isAuth);
    return(
      <header className={styles.header}>
        <button onClick={this.toggleSideBar.bind(this)} className={styles.header__icon} id={styles.header__icon} />
        <Link className={styles.header__logo} to="/" >
          <span role="img" aria-label="baby">🦄</span>
        </Link>
        <nav className={styles.menuLeft}>
          <Link className={styles.header__anchor} to="/">Home</Link>
          <Link className={styles.header__anchor} to="/statement">Statement</Link>
          <Link className={styles.header__anchor} to="/demo/form-element">Animals</Link>
        </nav>
        <nav className={styles.menuRight}>
          {!isAuth &&
            <Link className={styles.header__anchor} to="/user/login">Login</Link>
          }
          {isAuth &&
            <Link className={styles.header__anchor} to="/user/logout">Logout</Link>
          }
        </nav>
      </header>
    );
  }
};

export default connect(({ cookies: { token, user } }) => ({
  isAuth: !!token,
  user: user || {},
}), null, null, {
  pure: false,
})(NavigationBar);
