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

import TextAreaAdapter from '../../components/elements/adapters/TextAreaAdapter';

type Props = {};

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

class SearchBar extends PureComponent<Props> {


  constructor(){
    super();
    this.state = {
      data: {
        search: ''
      }
    };
    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setState({ data: {
      search: ''
    }
    })
  }

  updateInput(event){
    this.setState({search: event.target.value})
  }


  handleSubmit(){
    this.joinEvent(params.id, this.state.search);

  }


  render() {
    console.log('Login props:');
    console.log(this.props);
    return (
      <div className={styles.addStoryForm}>
        <Helmet title='Login' />
        <input type="text" onChange={this.updateInput} />
        <input type="submit" onClick={this.handleSubmit} />
      </div>
    )
  }
}
const connector: Connector<{}, Props> = connect(({  location, routing }: ReduxState) => ({
  location,
  routing
}));

// Enable hot reloading for async componet
export default compose(hot(module), withRouter, connector)(SearchBar);
