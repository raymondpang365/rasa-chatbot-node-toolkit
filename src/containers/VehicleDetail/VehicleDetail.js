/* @flow */

import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import { fetchVehicleIfNeeded } from '../../actions/vehicle';
import type {
  Vehicle as VehicleType,
  Dispatch,
  ReduxState
} from '../../types/index';

type Props = {
  vehicle: VehicleType,
  match: Object,
  fetchVehicleIfNeeded: (id: string) => void
};

class VehicleDetail extends PureComponent {
  constructor() {
    super();
    this.state = {
      isEditable: false,
      inputValue: ''
    };
  }

  renderInput() {
    const { inputValue } = this.state;

    return (
      <input
        type="text"
        value={inputValue}
        onChange={e =>
          this.setState({
            inputValue: e.target.value
          })
        }
      />
    );
  }

  renderControlButtons() {
    const { text, onSaveClick } = this.props;
    const { isEditable, inputValue } = this.state;

    return isEditable ? (
      <span>
        <button
          onClick={() =>
            onSaveClick(inputValue).then(() =>
              this.setState({ isEditable: false })
            )
          }
        >
          Save
        </button>
        <button onClick={() => this.setState({ isEditable: false })}>
          Cancel
        </button>
      </span>
    ) : (
      <span>
        <button
          onClick={() => this.setState({ isEditable: true, inputValue: text })}
        >
          Edit
        </button>
      </span>
    );
  }

  render() {
    const { vehicleDetail, match: { params } } = this.props;
    const vehicleDetailById = vehicleDetail[params.id];

    if (
      !vehicleDetailById ||
      vehicleDetailById.readyStatus === 'VEHICLE_REQUESTING'
    ) {
      return <p>Loading...</p>;
    } else if (vehicleDetailById.readyStatus === 'VEHICLE_FAILURE') {
      return <p>Oops, Failed to load detail!</p>;
    }

    const { onRemoveClick, text } = this.props;
    const { isEditable } = this.state;

    return (
      <li>
        {text}
        {isEditable && this.renderInput()}
        {this.renderControlButtons()}
        <button onClick={onRemoveClick}>x</button>
      </li>
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ vehicleDetail, role }: ReduxState) => ({ vehicleDetail, role }),
  (dispatch: Dispatch) => ({
    fetchVehicleIfNeeded: (id: string) => dispatch(fetchVehicleIfNeeded(id))
  })
);

// Enable hot reloading for async component
export default compose(hot(module), withRouter, connector)(VehicleDetail);
