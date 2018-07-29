/* @flow */

import React from 'react';

import { Link } from 'react-router-dom';

import styles from '../../styles/main.scss';

const StoryListItem = ({id, title}) => {
  console.log(id);
  return(
    <div className={styles.storyListItem}>
      <h3>{id}</h3>
      <Link to={`/story/${id}`}>
        <div>
          {title}
        </div>
      </Link>

    </div>
  )
};
export default StoryListItem;
