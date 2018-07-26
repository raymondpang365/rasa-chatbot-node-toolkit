import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { Link, withRouter } from 'react-router-dom';
import MakeAsyncFunction from "react-redux-promise-listener";
import type { Connector } from 'react-redux';
import styles from '../../styles/main.scss'
import type { ReduxState } from '../../types';
import promiseListener from '../../helpers/reduxPromiseListener';
import {
  SUBMIT_STORY,
  SUBMIT_STORY_SUCCESS,
  SUBMIT_STORY_FAILURE
} from "../../reducers/submitStory";

import TextAreaAdapter from '../../components/elements/adapters/TextAreaAdapter';

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
      <div className={styles.addStory}>
        <div className={styles.addStoryForm}>
          <Helmet title='Login' />
          <text className={styles.addStoryFormTitle}>Add Your Story</text>
          {this.props.location !== undefined && this.props.location.query.next && (
            <alert>
              <strong>Authentication Required</strong>
              {' '}Please login first.
            </alert>
          )}
          <MakeAsyncFunction
            listener={promiseListener}
            start={SUBMIT_STORY}
            resolve={SUBMIT_STORY_SUCCESS}
            reject={SUBMIT_STORY_FAILURE}
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
                             <div className={styles.textCenter}>
                               <Field
                                 name="Comment or answer"
                                 component={TextAreaAdapter}
                                 validate={composeValidators(required)}
                                 hintText="Comment or answer"
                                 spellcheck="false"
                                 floatingLabelText="Comment or answer"
                               />
                               <SubmitError name="login" />
                             </div>
                             <div className={styles.submitStoryFormButtonWrapper}>
                               <button className={styles.submitStoryFormButton}>
                                 Submit your Comment-
                               </button>
                             </div>
                             <br />

                           </form>
                )}
              />
            )}
          </MakeAsyncFunction>
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
