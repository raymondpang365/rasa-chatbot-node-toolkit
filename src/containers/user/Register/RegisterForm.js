import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { Link, withRouter } from 'react-router-dom';
import type { Connector } from 'react-redux';
import MakeAsyncFunction from "react-redux-promise-listener";
import styles from '../../../styles/main.scss'
import type { ReduxState } from '../../../types';
import SocialAuthButtonList from '../../../components/utils/SocialAuthButtonList';
import {
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE
} from "../../../reducers/registration";
import promiseListener from '../../../helpers/reduxPromiseListener';

import FormFieldAdapter from '../../../components/elements/adapters/FormFieldAdapter';


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

type Props = {};

class Register extends PureComponent<Props> {

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
          <MakeAsyncFunction
            listener={promiseListener}
            start={REGISTER}
            resolve={REGISTER_SUCCESS}
            reject={REGISTER_FAILURE}
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
                       <SubmitError name="email" />
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
                     <button className={styles.loginButton} type="submit" disabled={submitting}>
                       Sign Up with Email
                     </button>
                   </form>
                )}
              />
            )}
          </MakeAsyncFunction>
          <br />
          <hr className={styles.orSeparator} />
          <SocialAuthButtonList routing={this.props.routing} prependText="Continue" />
        </div>

      </div>
    )
  }
}
const connector: Connector<{}, Props> = connect(({  location, routing, registration }: ReduxState) => ({
  location,
  routing,
  registration
}));

// Enable hot reloading for async componet
export default compose(hot(module), withRouter, connector)(Register);
