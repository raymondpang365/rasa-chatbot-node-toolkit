import React from 'react';
import classNames from 'classnames';
import { withLastLocation } from 'react-router-last-location';
import styles from '../../styles/main.scss'

const SocialAuthButtonList = ({ lastLocation }) => {
  const search = lastLocation ? `?next=${lastLocation}` : '';
  const styleFB = classNames(`${styles.btnSi_a}`, `${styles.btnFacebook}`, `${styles.smaller}`);
  const styleGoogle = classNames(`${styles.btnSi_a}`, `${styles.btnGoogle}`, `${styles.smaller}`);
  return (
    <div>
      <div className={styles.socialButtonBox}>
        <a
          href={`/auth/facebook${search}`}
          className={styleFB}
        >
          Sign in with Facebook
        </a>
      </div>
      <div className={styles.socialButtonBox}>
        <a
          href={`/auth/google${search}`}
          className={styleGoogle}
        >
          Sign in with Google
        </a>
      </div>
    </div>
  );
};

export default  withLastLocation(SocialAuthButtonList);
