/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/main.scss';

// ({numInList, commentId, displayName, avatarUrl, content, likes, onClickLike})
const MatchListItem = ({numInList, matchId, title, displayName}) => {
  let element;
  console.log(numInList);
  const changeSrc = newSrc => {
    element.src = newSrc;
  };
  return(
    <div className={styles.storyListItem}>
      <Link to={`/match/${matchId}`}>
        <h2>
          {title}
        </h2>
      </Link>
      <div className={styles.userBrief}>
        <h3 className={styles.userName}>{displayName}</h3>

      </div>
    </div>
  )
};
export default MatchListItem;
