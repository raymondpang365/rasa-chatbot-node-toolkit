/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/main.scss';

// ({numInList, commentId, displayName, avatarUrl, content, likes, onClickLike})
const StoryListItem = ({numInList, storyId, title, displayName, avatarUrl}) => {
  let element;
  console.log(numInList);
  const changeSrc = newSrc => {
    element.src = newSrc;
  };
  return(
    <div className={styles.storyListItem}>
      <Link to={`/story/${storyId}`}>
        <h2>
          {title}
        </h2>
      </Link>
      <div className={styles.userBrief}>
        <div className={styles.profileIconWrapper}>
          <img
            className={styles.profileIcon}
            alt="me"
            onError={() => changeSrc('https://i.imgur.com/aBcof3d.png')}
            ref={el => {element = el}}
            src={avatarUrl}
          />
        </div>
        <h3 className={styles.userName}>{displayName}</h3>

      </div>
    </div>
  )
};
export default StoryListItem;
