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
  SUBMIT_COMMENT,
  SUBMIT_COMMENT_SUCCESS,
  SUBMIT_COMMENT_FAILURE
} from "../../reducers/submitComment";

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

class PostCommentForm extends PureComponent<Props> {

  render() {
    console.log('Login props:');
    console.log(this.props);
    return (
      <div className={styles.addCommentForm}>
        <Helmet title='Login' />
        {this.props.location !== undefined && this.props.location.query.next && (
          <alert>
            <strong>Authentication Required</strong>
            {' '}Please login first.
          </alert>
        )}
        <MakeAsyncFunction
          listener={promiseListener}
          start={SUBMIT_COMMENT}
          resolve={SUBMIT_COMMENT_SUCCESS}
          reject={SUBMIT_COMMENT_FAILURE}
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
                           <Field
                             name="content"
                             component={TextAreaAdapter}
                             validate={composeValidators(required)}
                             hintText="Comment or answer"
                             spellcheck="false"
                             floatingLabelText="Comment or answer"
                           />
                           <SubmitError name="login" />
                           <div className={styles.submitCommentFormButtonWrapper}>
                             <button className={styles.submitCommentFormButton}>
                               Submit your Comment
                             </button>
                           </div>
                           <br />

                         </form>
              )}
            />
          )}
        </MakeAsyncFunction>
      </div>


    )
  }
}
const connector: Connector<{}, Props> = connect(({  location, routing }: ReduxState) => ({
  location,
  routing
}));

// Enable hot reloading for async componet
export default compose(hot(module), withRouter, connector)(PostCommentForm);
