/* @flow */

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import type { ReduxState } from '../../types';
import ErrorList from '../../components/utils/ErrorList';
// import PageLayout from '../layout/PageLayout';
import styles from '../../styles/main.scss';
import updateLocale from '../../actions/intl';
import { pushErrors } from '../../actions/error';
import FormField from '../../components/elements/widgets/FormField';

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
    return (
      <div className={styles.siteContent}>
        <div className={styles.container}>
          <div className={styles.login}>
            <ErrorList />
            <Helmet title="Home" />
            <h2 className={styles.loud}>Cartoon animal community </h2>
          </div>
        </div>
      </div>
    );
  }
}

const connector: Connector<{}, Props> = connect(({ home }: ReduxState) => ({
  home
}));

// Enable hot reloading for async componet
export default compose(hot(module), withRouter, connector)(Home);
