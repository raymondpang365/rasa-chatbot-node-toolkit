/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import updateLocale from '../../actions/intl';

import type { Dispatch } from '../../types/index';

class LocaleProvider extends Component {
  componentDidMount() {
    const { intl } = this.props;
    const lang = intl.locale || navigator.language;

    this.props.updateLocale(lang).then(
      () => {
        console.log('load locale (automatically) ok');
      },
      err => {
        console.log('load locale (automatically) fail', err);
      }
    );
  }

  render() {
    const { intl, children } = this.props;

    return (
      <IntlProvider locale={intl.locale} messages={intl.messages}>
        {children}
      </IntlProvider>
    );
  }
}

LocaleProvider.defaultProps = {
  children: {},
  intl: {}
};

LocaleProvider.propTypes = {
  children: PropTypes.any,
  intl: PropTypes.any
};

const mapStateToProps = state => ({
  intl: state.intl
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateLocale: lang => dispatch(updateLocale(lang))
});

export default connect(mapStateToProps, mapDispatchToProps)(LocaleProvider);
