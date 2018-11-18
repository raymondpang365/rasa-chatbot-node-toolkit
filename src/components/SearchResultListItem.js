/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/main.scss';

// ({numInList, commentId, displayName, avatarUrl, content, likes, onClickLike})
const SearchResultListItem = ({numInList, matchId, score, imageUrl, title}) => {
  let element;
  console.log(numInList);
  const changeSrc = newSrc => {
    element.src = newSrc;
  };
  return(
    <div className={styles.matchResultItem}>
      <div className={styles.businessImageWrapper}>
        <img
          className={styles.businessImage}
          alt="me"
          onError={() => changeSrc('https://i.imgur.com/aBcof3d.png')}
          ref={el => {element = el}}
          src={imageUrl}
        />
      </div>
      <div className={styles.matchResultBrief}>
        <Link to={`/match/${matchId}`}>
          <h2>
            {title}
          </h2>
        </Link>
        <h4> Preference Score: {score} </h4>
      </div>
    </div>
  )
};
export default SearchResultListItem;
