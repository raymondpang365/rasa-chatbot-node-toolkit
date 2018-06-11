import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import type { Connector } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withRouter } from 'react-router-dom';
import {logoutUser} from "../../../actions/user";

import type {
  Dispatch
} from '../../../types/index';


type Props = {};

class Logout extends PureComponent<Props>{


  componentWillMount(){
    console.log(this.props.dispatch);
    const { dispatch } = this.props;
    dispatch(logoutUser());
  }
  render() {
    console.log('Logout props');
    console.log(this.props);
    console.log('Logout props');
    return null;
  }

}




const mapDispatchToProps = (dispatch: Dispatch) => ({
  logoutUser: () => dispatch(logoutUser())
});
const connector: Connector<{}, Props> = connect(
  mapDispatchToProps
);


// Enable hot reloading for async componet
export default compose(hot(module), connector, withRouter)(Logout);
