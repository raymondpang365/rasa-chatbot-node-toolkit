import React, { PureComponent } from 'react';
import { push } from 'connected-react-router';
import { compose } from 'redux';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { Link, withRouter } from 'react-router-dom';
import type { Connector } from 'react-redux';
import styles from '../../../styles/main.scss'
import type { ReduxState } from '../../../types';
import {  emailRegister } from'../../../actions/user';
import { pushErrors } from '../../../actions/error';
import SocialAuthButtonList from '../../../components/utils/SocialAuthButtonList';


import FormFieldAdapter from '../../../components/elements/adapters/FormFieldAdapter';


const validEmail = value => {
  const rg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.]{3,9})+\.([A-Za-z]{2,4})$/;
  return (rg.test(value) && value !== 0) ? undefined : 'Not an email';
};

const required = value => (value ? undefined : "Required");

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

type Props = {};

class Register extends PureComponent<Props> {

  onSubmit(values){
    console.log(this);
    const{ dispatch } = this.props;

    dispatch(emailRegister(values))
      .catch((err) => {
        dispatch(pushErrors(err));
        throw err;
      })
      .then(json => {
        dispatch(push('/user/login'));
      });
  };

  render() {
    console.log('Register props');
    console.log(this.props);
    console.log('Register props');

    return (
      <div className={styles.login}>
        <div className={styles.loginForm}>
          <Helmet title='Register' />
          <text className={styles.loginFormTitle}>
            Create a New Account
          </text>
          {this.props.location !== undefined && this.props.location.query.next && (
            <alert>
              <strong>Authentication Required</strong>
              {' '}Please login first.
            </alert>
          )}
          <Form
            onSubmit={this.onSubmit.bind(this)}
            render={({
                       handleSubmit,
                       submitError,
                       reset,
                       submitting,
                       pristine,
                       validating,
                       values
                     }) => (
                       <form onSubmit={handleSubmit}>
                         <div>
                           <Field
                             name="name"
                             component={FormFieldAdapter}
                             validate={composeValidators(required)}
                             hintText="Display Name"
                             type="name"
                             spellcheck="false"
                             floatingLabelText="Display Name :"
                           />
                           <Field
                             name="email"
                             component={FormFieldAdapter}
                             validate={composeValidators(validEmail, required)}
                             hintText="Email"
                             type="email"
                             spellcheck="false"
                             floatingLabelText="Email :"
                           />
                           <Field
                             name="password"
                             component={FormFieldAdapter}
                             validate={composeValidators(required)}
                             type="password"
                             hintText="Password"
                             spellcheck="false"
                             floatingLabelText="Password :"
                           />
                           {submitError && <div className="error">{submitError}</div>}
                         </div>
                         <button className={styles.loginButton}>
                           Sign Up with Email
                         </button>
                       </form>
            )}
          />
          <br />
          <hr className={styles.orSeparator} />
          <SocialAuthButtonList routing={this.props.routing} prependText="Continue" />
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
export default compose(hot(module), withRouter, connector)(Register);
