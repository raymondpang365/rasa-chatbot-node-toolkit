import React from 'react';
import classNames from 'classnames';
import { withLastLocation } from 'react-router-last-location';
import styles from '../../styles/main.scss'

const SocialAuthButtonList = ({ lastLocation, prependText }) => {
  const search = lastLocation ? `?next=${lastLocation}` : '';
  const styleFB = classNames( `${styles.btnFacebook}`, `${styles.smaller}`);
  const styleGoogle = classNames( `${styles.btnGoogle}`, `${styles.smaller}`);

  const textBuilding = platform => `${prependText} with ${platform}`;

  console.log(prependText)
  return (
    <React.Fragment>
      <a
        href={`/auth/facebook${search}`}
        className={styles.buttonBoxFB}
      >
        <text className={styleFB}> {textBuilding("Facebook")} </text>
      </a>
      <a
        href={`/auth/google${search}`}
        className={styles.buttonBoxGoogle}
      >
        <text className={styleGoogle}> {textBuilding("Google")} </text>
      </a>
    </React.Fragment>
  );

};

export default  withLastLocation(SocialAuthButtonList);
