import React from 'react';
import styles from '../../styles/main.scss';

const CommentListItem = ({numInList, commentId, displayName, avatarUrl, content, likes, onClickLike}) => {
  let element;
  console.log(numInList);
  const changeSrc = newSrc => {
    element.src = newSrc;
  };



  return (
    <div className={styles.commentListItem}>
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


      <div>
        <h4>comment:{content}</h4>
      </div>
      <div>
        <button onClick={onClickLike(numInList, commentId)}>
          Thank
        </button>
        <h3>Thanks: {likes}</h3>
      </div>
      <hr />
    </div>
  );
};
export default CommentListItem;
