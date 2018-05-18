import React from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import isString from 'lodash/isString';
import { connect } from 'react-redux';
import { removeError } from '../../actions/error';
import ErrorCodes from '../../constants/ErrorCodes';

function renderMetaContent(metaContent) {
  if (isString(metaContent)) {
    return metaContent;
  }

  return <pre>{JSON.stringify(metaContent, null, 2)}</pre>;
}

function renderMeta(meta) {
  if (isString(meta)) {
    return <p>{meta}</p>;
  }

  return (
    <tbody>
      {Object.keys(meta).map(key => (
        <tr key={key}>
          <td>{key}</td>
          <td>{renderMetaContent(meta[key])}</td>
        </tr>
      ))}
    </tbody>
  );
}

const ErrorList = ({ errors, dispatch }) => {
  if (errors !== null) {
    errors.map(error => {
      if (
        [ErrorCodes.TOKEN_EXPIRATION, ErrorCodes.BAD_TOKEN].indexOf(
          error.code
        ) >= 0
      ) {
        dispatch(removeError(error.id));
        dispatch(push('/user/login'));
      }
      if (
        [ErrorCodes.USER_UNAUTHORIZED, ErrorCodes.PERMISSION_DENIED].indexOf(
          error.code
        ) >= 0
      ) {
        dispatch(removeError(error.id));
        dispatch(push('/'));
      }

      return (
        <li key={error.id}>
          <h4>{error.title}</h4>
          {` ${error.detail}`}
          {error.meta && renderMeta(error.meta)}
        </li>
      );
    })
  }
  return null;
};

ErrorList.propTypes = {
  errors: PropTypes.any,
  dispatch: PropTypes.func
};

ErrorList.defaultProps = {
  errors: null,
  dispatch: null
};

export default connect(state => ({
  errors: state.errors
}))(ErrorList);
