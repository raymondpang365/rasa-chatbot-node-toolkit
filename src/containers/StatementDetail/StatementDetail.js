/* @flow */

import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import { fetchStatementIfNeeded } from '../../actions/statement';
import type {
  Statement as StatementType,
  Dispatch,
  ReduxState
} from '../../types/index';

type Props = {
  statement: StatementType,
  match: Object,
  fetchStatementIfNeeded: (id: string) => void
};

class StatementDetail extends PureComponent {
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
    const { statementDetail, match: { params } } = this.props;
    const statementDetailById = statementDetail[params.id];

    if (
      !statementDetailById ||
      statementDetailById.readyStatus === 'STATEMENT_REQUESTING'
    ) {
      return <p>Loading...</p>;
    } else if (statementDetailById.readyStatus === 'STATEMENT_FAILURE') {
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
  ({ statementDetail, role }: ReduxState) => ({ statementDetail, role }),
  (dispatch: Dispatch) => ({
    fetchStatementIfNeeded: (id: string) => dispatch(fetchStatementIfNeeded(id))
  })
);

// Enable hot reloading for async component
export default compose(hot(module), withRouter, connector)(StatementDetail);
