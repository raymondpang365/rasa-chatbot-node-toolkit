import React, { PureComponent } from 'react';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { FORM_ERROR } from "final-form";
import { Link, withRouter } from 'react-router-dom';
import type { Connector } from 'react-redux';
import styles from '../../../styles/main.scss'
import type { ReduxState } from '../../../types';
import { loginUser } from'../../../actions/user';
import userAPI from '../../../api/user'
import { pushErrors } from '../../../actions/error';
import SocialAuthButtonList from '../../../components/utils/SocialAuthButtonList';


import FormFieldAdapter from '../../../components/elements/adapters/FormFieldAdapter';


const validEmail = value => {
  const rg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.]{3,9})+\.([A-Za-z]{2,4})$/;
  return (rg.test(value) && value !== 0) ? undefined : 'Not an email';
};

const required = value => (value ? undefined : "Required");


const onSubmit = async values => {
  const{ dispatch, apiEngine, change } = this.props;
    userAPI(apiEngine)
      .login(values)
      .catch((err) => {
        dispatch(pushErrors(err));
        throw err;
      })
      .then(json => {
        if (json.isAuth) {
          // redirect to the origin path before logging in
          const { next } = this.props.routing.locationBeforeTransitions.query;

          window.alert("LOGIN SUCCESS!");

          dispatch(loginUser({
            token: json.token,
            data: json.user,
          }));
          dispatch(push(next || '/'));
          return json;
        } else {
          change('password', '');
          return { [FORM_ERROR]: "Login failed. You may type wrong email or password." };
        }
      });
};





const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

type Props = {};

class Login extends PureComponent<Props> {
  render() {
    return (
      <div className={styles.login}>
        <div className={styles.container}>
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
                         floatingLabelText="Email :"
                       />
                       <Field
                         name="password"
                         component={FormFieldAdapter}
                         validate={composeValidators(required)}
                         type="password"
                         hintText="Password"
                         floatingLabelText="Password :"
                       />
                       {submitError && <div className="error">{submitError}</div>}
                     </div>
                     <button className={styles.loginButton}>
                       Login
                     </button>
                     <Link className={styles.loginFormText} to="/user/password/forget">
                       Forget password?
                     </Link>

                   </form>
                )}
              />
              <SocialAuthButtonList routing={this.props.routing} />
            </div>

          </div>
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

