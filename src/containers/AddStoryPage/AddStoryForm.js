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
import BudgetInputAdapter from '../../components/elements/adapters/BudgetInputAdapter';

type Props = {};

const validAmount = value => {
  const rg = /^[+]?\d+$/;
  return (rg.test(value) && value >= 100) ? undefined : 'Minimum cost of posting a problem is 100';
};

const isPositiveInteger = value => {
  const rg = /^[+]?\d+$/;
  return (rg.test(value) && value >= 0) ? undefined : 'Must be an integer';
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

  state = {
    data: {
      title: '',
      goal: '',
      limitation: '',
      v_budget: 100,
      c_budget: 0
    }
  };

  componentWillMount() {
    this.setState({ data: {
        title: '',
        goal: '',
        limitation: '',
        v_budget: 100,
        c_budget: 0
      }
    })
  }

  render() {
    console.log('Login props:');
    console.log(this.props);
    return (
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
              initialValues={this.state.data}
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
                               name="title"
                               component={TextAreaAdapter}
                               validate={composeValidators(required)}
                               hintText="Title"
                               spellcheck="false"
                               floatingLabelText="Title"
                             />
                             <Field
                               name="goal"
                               component={TextAreaAdapter}
                               validate={composeValidators(required)}
                               hintText="Write your story"
                               spellcheck="false"
                               floatingLabelText="Your Goal"
                             />
                             <Field
                               name="limitation"
                               component={TextAreaAdapter}
                               validate={composeValidators(required)}
                               hintText="Write your limitation"
                               spellcheck="false"
                               floatingLabelText="Your Obstacle"
                             />
                             <Field
                               name="v_budget"
                               component={BudgetInputAdapter}
                               validate={composeValidators(validAmount)}
                               defaultValue='100'
                               floatingLabelText="Score reward: (minimum 100)"
                             />
                             <Field
                               name="c_budget"
                               component={BudgetInputAdapter}
                               validate={composeValidators(isPositiveInteger)}
                               defaultValue='0'
                               floatingLabelText="Real cash reward :"
                             />
                             <SubmitError name="login" />
                           </div>

                           <button className={styles.submitCommentFormButton}>
                            Submit your Question
                           </button>

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
export default compose(hot(module), withRouter, connector)(Login);
