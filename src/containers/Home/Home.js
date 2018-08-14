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
                <h2>Truly solving your needs</h2>
                <h5>powered by buzzword technology</h5>
                <Link className={styles.btn_more} to="/addstory">
                  Call to Action Button Now
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.second_section}>
            <div className={styles.card}>
              <div>
                Secure
              </div>
              <div>
                Sample dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
              </div>
            </div>
            <div className={styles.card}>
              <div>
                Affordable
              </div>
              <div>
                Example Lorem ipsum dolor sit amet, conscing elit. Aenean commodo ligula eget dolor. Aenean massa.
              </div>
            </div>
            <div className={styles.card}>
              <div>
                Convenient
              </div>
              <div>
                Random Lorem ipsum dolor sit amet, co. Aenean commodo ligula eget dolor. Aenean massa.
              </div>
            </div>
          </div>
          <div className={styles.third_section}>
            <div className={styles.half}>
              <div className={styles.overlay} />
              <div className={styles.half_content}>
                <h2>Truly solve your needs</h2>
                <h5>powered by multiple buzzword technologies</h5>
                <a className={styles.btn_more}>What are you waiting for?</a>
              </div>
            </div>
          </div>
          <div className={styles.story_section}>
            <div className={styles.card}>
              <div>
                Secure
              </div>
              <div>
                Sample dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
              </div>
            </div>
            <div className={styles.card}>
              <div>
                Affordable
              </div>
              <div>
                Example Lorem ipsum dolor sit amet, conscing elit. Aenean commodo ligula eget dolor. Aenean massa.
              </div>
            </div>
            <div className={styles.card}>
              <div>
                Convenient
              </div>
              <div>
                Random Lorem ipsum dolor sit amet, co. Aenean commodo ligula eget dolor. Aenean massa.
              </div>
            </div>
          </div>
          <div className={styles.media_section}>
            <br />
            <h3>Need help?</h3>
            <a className={styles.btn_more}>Contact Us</a>
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
