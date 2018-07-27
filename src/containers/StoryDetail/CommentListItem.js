import React from 'react';
import styles from '../../styles/main.scss';

const CommentListItem = ({key, user, content, likes}) => (
  <div>
    <h3>{key}</h3>
    <h3>{user}</h3>
    <h5>{content}</h5>
    <h5>{likes}</h5>
    <hr />
  </div>
);
export default CommentListItem;
