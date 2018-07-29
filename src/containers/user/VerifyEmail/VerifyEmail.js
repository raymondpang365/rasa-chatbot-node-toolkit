import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/lib/Alert';
import userAPI from '../../../api/user';
import styles from '../../../styles/main.scss';
import { pushErrors } from '../../../actions/error';
import { verifyEmail } from "../../../actions/user";

class VerificationPage extends Component {
  constructor() {
    super();
    this.state = {
      isVerifying: true,
      isFail: true,
    };
  }

  componentWillMount() {
    const { dispatch, location } = this.props;
    console.log('hoho bibibo')
    console.log(this.props);
    if (typeof window === 'object') {
      dispatch(verifyEmail(location.search.split("token=")[1]))
        .then((json) => {
          this.setState({
            isVerifying: false,
            isFail: false,
          });
        })
        .catch((err) => {
          this.setState({
            isVerifying: false,
            isFail: true,
          });
          dispatch(pushErrors(err));
          throw err;
        });
    }
  }

  render() {
    const { isVerifying, isFail } = this.state;

    if (isVerifying) {
      return (
        <div className={styles.siteContent}>
          <div className={styles.pageContainer}>
            <p>Please wait for a while...</p>
          </div>
        </div>
      );
    }

    if (isFail) {
      return (
        <div className={styles.siteContent}>
          <div className={styles.pageContainer}>
            <Alert bsStyle="danger">
              <strong>Verification Failed</strong>
            </Alert>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.siteContent}>
        <div className={styles.bgContainer}>
          <Alert bsStyle="success">
            <strong>Verification Success</strong>
            <p>
              Go to <Link to="/user/login">Login Page</Link>
            </p>
          </Alert>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  state,
}))(VerificationPage);
