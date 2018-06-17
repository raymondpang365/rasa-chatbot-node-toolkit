import React, { PureComponent } from 'react';
import { push } from 'connected-react-router';
import { compose } from 'redux';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { FORM_ERROR } from "final-form";
import { Link, withRouter } from 'react-router-dom';
import MakeAsyncFunction from "react-redux-promise-listener";
import type { Connector } from 'react-redux';
import styles from '../../../styles/main.scss'
import type { ReduxState } from '../../../types';
import SocialAuthButtonList from '../../../components/utils/SocialAuthButtonList';
import promiseListener from '../../../helpers/reduxPromiseListener';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from "../../../reducers/login";

import FormFieldAdapter from '../../../components/elements/adapters/FormFieldAdapter';

type Props = {};

const validEmail = value => {
  const rg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.]{3,9})+\.([A-Za-z]{2,4})$/;
  return (rg.test(value) && value !== 0) ? undefined : 'Not an email';
};

const required = value => (value ? undefined : "Required");

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

const SubmitError = ({ name }) => (
  <Field
    name={name}
    subscription={{ submitError: true, dirtySinceLastSubmit: true }}
  >
    {({ meta: { submitError, dirtySinceLastSubmit } }) =>
      submitError && !dirtySinceLastSubmit ? <span className={styles.errorLabel}>{submitError}</span> : null
    }
  </Field>
);

class Login extends PureComponent<Props> {

  render() {
    console.log('Login props:');
    console.log(this.props);
    return (
      <div className={styles.login}>
        <div className={styles.loginForm}>
          <Helmet title='Login' />
          <text className={styles.loginFormTitle}>Sign In</text>
          {this.props.location !== undefined && this.props.location.query.next && (
            <alert>
              <strong>Authentication Required</strong>
              {' '}Please login first.
            </alert>
          )}
          <MakeAsyncFunction
            listener={promiseListener}
            start={LOGIN}
            resolve={LOGIN_SUCCESS}
            reject={LOGIN_FAILURE}
          >
            {onSubmit => (
              <Form
                onSubmit={onSubmit}
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
                               <SubmitError name="login" />
                             </div>

                             <button className={styles.loginButton}>
                               Login with Email
                             </button>
                             <br />

                             <Link className={styles.loginFormText} to="/user/register">
                               Create an account
                             </Link>
                             <text className={styles.loginFormTextSeparator} >|</text>
                             <Link className={styles.loginFormText} to="/user/password/forget">
                               Forget password
                             </Link>

                           </form>
                )}
              />
            )}
          </MakeAsyncFunction>
          <br />
          <hr className={styles.orSeparator} />
          <SocialAuthButtonList routing={this.props.routing} prependText="Login" />
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
