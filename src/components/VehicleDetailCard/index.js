/* @flow */

import React from 'react';

import styles from '../../styles/main.scss';

type Props = { info: Object, role: String };

const VehicleDetailCard = ({ info, role }: Props) => {
  switch (role) {
    case 'admin':
      return (
        <div className={styles.VehicleDetail}>
          <h4>Vehicle Card</h4>
          <ul>
            <li>Name: {info.name}</li>
            <li>Phone: {info.phone}</li>
            <li>Email: {info.email}</li>
            <li>Website: {info.website}</li>
          </ul>
        </div>
      );
    default:
      return (
        <div className={styles.VehicleDetail}>
          <h4>Vehicle Card</h4>
          <ul>
            <li>Name: {info.name}</li>
            <li>Phone: {info.phone}</li>
            <li>Email: {info.email}</li>
            <li>Website: {info.website}</li>
          </ul>
        </div>
      );
  }
};

export default VehicleDetailCard;
