import React from 'react';
import styles from '../../styles/main.scss';

const CommentListItem = (key, user, content, likes) => (
  <div className={styles.CommentListItem}>
    <h3>{user}</h3>
    <h5>{content}</h5>
    <h5>{likes}</h5>
  </div>
);
export default CommentListItem;
