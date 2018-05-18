/* @flow */

import React from 'react';

import { Link } from 'react-router-dom';

import styles from '../../styles/main.scss';

const StatementListCard = (
  key: number,
  onRemoveClick,
  onSaveClick,
  name: string
) => (
  <div className={styles.StatementListCard}>
    <li key={key}>
      <Link to={`/StatementInfo/${key}`}>{name}</Link>
    </li>
  </div>
);
export default StatementListCard;
