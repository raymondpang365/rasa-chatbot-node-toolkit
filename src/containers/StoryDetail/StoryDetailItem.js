/* @flow */

import React from 'react';

import { Link } from 'react-router-dom';

import styles from '../../styles/main.scss';

const StoryDetailItem = ({id, title, goal, limitation, vReward, cReward}) => {
  console.log(id);

  const cashAmount =  (cReward === 0)? '' : `USD ${cReward}`;

  return(
    <div className={styles.storyDetailItem}>

      <h2>
        {title}
      </h2>
      <h4>
        Goal:
      </h4>
      <div>
        {goal}
      </div>
      <h4>
        Limitation:
      </h4>
      <div>
        {limitation}
      </div>
      <h4>
        Total reward:
      </h4>
      <div>
        {vReward} Scores
        {cashAmount}
      </div>
    </div>
  )
};
export default StoryDetailItem;
