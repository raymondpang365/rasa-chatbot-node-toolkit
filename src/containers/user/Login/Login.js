import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { Link, withRouter } from 'react-router-dom';
import type { Connector } from 'react-redux';
import styles from '../../../styles/main.scss'
import type { ReduxState } from '../../../types';
import LoginForm from './LoginForm'

type Props = {};

class Login extends PureComponent<Props> {

  render() {
    console.log('Login props:');
    console.log(this.props);
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loginContainerFull}>
          <LoginForm />
        </div>
      </div>
    )
  }
}
const connector: Connector<{}, Props> = connect(({  location, routing }: ReduxState) => ({
  location,
  routing
}));

// Enable hot reloading for async componet
export default compose(hot(module), withRouter, connector)(Login);

