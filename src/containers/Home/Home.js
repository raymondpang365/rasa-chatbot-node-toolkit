/* @flow */

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import type { ReduxState } from '../../types';
import ErrorList from '../../components/utils/ErrorList';
import styles from '../../styles/main.scss';
import updateLocale from '../../actions/intl';
import { pushErrors } from '../../actions/error';
import Footer from '../../components/utils/Footer'

type Props = {};

// Export this for unit testing more easily
export class Home extends Component<Props> {
  setLanguage(lang) {
    const { store } = this.context;
    store.dispatch(updateLocale(lang)).then(
      () => {
        console.log('load locale (manually) ok');
      },
      err => {
        store.dispatch(pushErrors(err));
      }
    );
  }

  render() {

    const { isAuth, user } = this.props;
    console.log('Home props:');
    console.log(this.props);
    return (
      <div className={styles.pageContainer}>
        <div className={styles.homeContainer}>
          <Helmet title="Home" />
          <div className={styles.first_section}>
            <div className={styles.half}>
              <div className={styles.overlay} />
              <div className={styles.half_content}>
                <h2>Satisfy everyone</h2>
                <h5>in any gathering and event</h5>
                <Link className={styles.btn_more} to="/match">
                  CREATE AN EVENT NOW
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.second_section}>
            <div className={styles.card}>
              <div>
                Where
              </div>
              <div>
                Let us choose a restaurant for you folks to satisfy as many people as possible
              </div>
            </div>
            <div className={styles.card}>
              <div>
                When
              </div>
              <div>
                By connecting to Calendar apps, let us choose a time that fits everyone schedule.
              </div>
            </div>
            <div className={styles.card}>
              <div>
                Together
              </div>
              <div>
                Share event experience together. Enjoy discount together.
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>

    );
  }
}

const connector: Connector<{}, Props> = connect(({ home, routing, cookies: { token, user } }: ReduxState) => ({
  home,
  routing,
  isAuth: !!token,
  user: user || {}
}));

// Enable hot reloading for async componet
export default compose(withRouter, connector)(Home);
