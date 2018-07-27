/* @flow */

import React from 'react';

import { Link } from 'react-router-dom';

import styles from '../../styles/main.scss';

const StoryDetailItem = ({id, title, goal, limitation}) => {
  console.log(id);
  return(
    <div>
      <h3>{id}</h3>
      <Link to={`/story/${id}`}>
        <div>
          Title:
        </div>
        <div>
          {title}
        </div>
        <div>
          Goal:
        </div>
        <div>
          {goal}
        </div>
        <div>
          Limitation:
        </div>
        <div>
          {limitation}
        </div>
      </Link>

    </div>
  )
};
export default StoryDetailItem;
