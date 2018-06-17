import React from 'react';
import propTypes from 'prop-types'
import tokenToURL from '../utils/tokenToURL';

const ResetPasswordMail = ({ requestedAt, token }) => {
  const  url = tokenToURL('/user/password/reset', token);

  return (
    <div>
      <p>
        Someone requested to reset your password at
        {' '}<time>{requestedAt.toString()}</time>.
        If you did not ask for such request, please ignore this mail.
      </p>
      <p>
        Please follow the link to reset your email:
      </p>
      <p>
        <a href={url}>
          {url}
        </a>
      </p>
    </div>
  );
};

ResetPasswordMail.propTypes = {
  requestedAt: propTypes.instanceOf(Date),
  token: propTypes.string,
};

export default ResetPasswordMail;
