import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { Link, withRouter } from 'react-router-dom';
import type { Connector } from 'react-redux';
import styles from '../../styles/main.scss'
import type { ReduxState } from '../../types';

import AddStoryForm from './AddStoryForm'

type Props = {};

class AddStoryPage extends PureComponent<Props> {

  render() {
    console.log('Register props');
    console.log(this.props);
    console.log('Register props');

    return (

      <div className={styles.addStoryContainerFull}>
        <div className={styles.addStory}>
          <AddStoryForm />
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
export default compose(hot(module), withRouter, connector)(AddStoryPage);
