import React from 'react';
import styles from '../../styles/main.scss';

const CommentListItem = ({commentId, displayName, avatarUrl, content, likes}) => (
  <div className={styles.commentListItem}>
    <div>
      <h3>displayName: {displayName}</h3>
    </div>
    <div>
      <h3>comment:{content}</h3>
    </div>
    <div>
      <h3>likes: {likes}</h3>
    </div>
    <hr />
  </div>
);
export default CommentListItem;
