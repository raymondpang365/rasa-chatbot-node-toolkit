/* @flow */

import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import PostCommentForm from './PostCommentForm'
import InfiniteScroll from '../../components/utils/InfiniteScroll';

import styles from '../../styles/main.scss';
import { fetchCommentsIfNeeded } from '../../actions/comments';
import { fetchStoryIfNeeded } from '../../actions/story';

import CommentListItem from './CommentListItem';
import type {
  Story as StoryType,
  Dispatch,
  ReduxState
} from '../../types/index';

type Props = {
  story: StoryType,
  match: Object,
  fetchStoryIfNeeded: (id: string) => void
};

class StoryDetail extends PureComponent {
  constructor() {
    super();
    this.state = {
      isEditable: false,
      inputValue: ''
    };
  }

  componentDidMount() {

    this.props.fetchCommentsIfNeeded(1);
  }




  loadMore(page){
    this.props.fetchCommentsIfNeeded(page);
  }

  renderControlButtons() {
    const { text, onSaveClick } = this.props;
    const { isEditable, inputValue } = this.state;

    return isEditable ? (
      <span>
        <button
          onClick={() =>
            onSaveClick(inputValue).then(() =>
              this.setState({ isEditable: false })
            )
          }
        >
          Save
        </button>
        <button onClick={() => this.setState({ isEditable: false })}>
          Cancel
        </button>
      </span>
    ) : (
      <span>
        <button
          onClick={() => this.setState({ isEditable: true, inputValue: text })}
        >
          Edit
        </button>
      </span>
    );
  }

  renderInput() {
    const { inputValue } = this.state;
    return (
      <input
        type="text"
        value={inputValue}
        onChange={e =>
          this.setState({
            inputValue: e.target.value
          })
        }
      />
    );
  }

  renderCommentList() {
    let loader;
    const items = [];
    if (
      this.props.comments.readyStatus === "FETCH_COMMENTS_FAILURE"
    ) {
      loader = <p>Oops, Failed to load items!</p>;
    } else if (this.props.comments.readyStatus === 'FETCH_COMMENTS_SUCCESS') {
      this.props.comments.data.map(comment => {
        items.push(
          <CommentListItem
            user={comment.user_id}
            content={comment.content}
            likes={comment.likes}
          />
        );
      });
    } else {
      loader = <div className="loader">Loading ...</div>;
    }

    console.log(items);
    return (
      (items === []) ?
        <div>
          <p>Uh oh, seems like there is no any items yet! Please add one :)</p>
        </div> :
        <InfiniteScroll
          page={this.props.page.current}
          hasMore={this.props.page.current < this.props.page.last}
          loadMore={this.loadMore}
          loader={loader}
        >
          <div className="tracks">{items}</div>
        </InfiniteScroll>
    );
  }

  render() {
    const { storyDetail, match: { params } } = this.props;
    const storyDetailById = storyDetail[params.id];

    if (
      !storyDetailById ||
      storyDetailById.readyStatus === 'STORY_REQUESTING'
    ) {
      return <p>Loading...</p>;
    } else if (storyDetailById.readyStatus === 'STORY_FAILURE') {
      return <p>Oops, Failed to load detail!</p>;
    }

    const { onRemoveClick, text } = this.props;
    const { isEditable } = this.state;

    return (
      <div className={styles.siteContent}>
        <div className={styles.container}>
          <PostCommentForm />
          {this.renderCommentList()}
        </div>
      </div>

    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ comments, role }: ReduxState) => ({ comments, role }),
  (dispatch: Dispatch) => ({
    fetchCommentsIfNeeded: (id: string) => dispatch(fetchCommentsIfNeeded(id)),
    fetchStoryIfNeeded: (id: string) => dispatch(fetchStoryIfNeeded(id))
  })
);

// Enable hot reloading for async component
export default compose(hot(module), withRouter, connector)(StoryDetail);
