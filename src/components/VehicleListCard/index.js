/* @flow */

import React from 'react';

import { Link } from 'react-router-dom';

import styles from '../../styles/main.scss';

const VehicleListCard = (
  key: number,
  onRemoveClick,
  onSaveClick,
  name: string
) => (
  <div className={styles.VehicleListCard}>
    <li key={key}>
      <Link to={`/VehicleInfo/${key}`}>{name}</Link>
    </li>
  </div>
);
export default VehicleListCard;
