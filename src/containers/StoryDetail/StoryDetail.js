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
import { likeComment, fetchCommentsIfNeeded } from '../../actions/comments';
import { fetchStoryIfNeeded, setSelectedStory} from '../../actions/story';

import CommentListItem from './CommentListItem';

import {
  FETCH_COMMENTS_SUCCESS,
  FETCH_COMMENTS_REQUESTING,
  FETCH_COMMENTS_FAILURE,
  FETCH_COMMENTS_INVALID
} from "../../reducers/comments";

import {

  FETCH_STORY_REQUESTING,
  FETCH_STORY_SUCCESS,
  FETCH_STORY_FAILURE
} from "../../reducers/story";

import type {
  Story as StoryType,
  Dispatch,
  ReduxState
} from '../../types/index';
import StoryDetailItem from "./StoryDetailItem";

type Props = {
  story: StoryType,
  match: Object,
  fetchStoryIfNeeded: (id: number) => void
};

class StoryDetail extends PureComponent {
  constructor() {
    super();
    this.state = {
      isEditable: false,
      inputValue: '',
      comments: {
        readyStatus: FETCH_COMMENTS_INVALID,
        err: null,
        data: []
      }
    };
    this.onClickLike = this.onClickLike.bind(this);
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.props.setSelectedStory( params.id);
    this.props.fetchStoryIfNeeded(params.id);
    this.props.fetchCommentsIfNeeded(params.id);
  }

  componentWillReceiveProps(newProps){
    if(JSON.stringify(newProps.comments) !== JSON.stringify(this.comments) ){
      this.setState({comments: newProps.comments })
    }
  }

  onClickLike(numInList, commentId){

    const addLikes = function() {
      console.log(numInList, commentId);
      const {data} = this.state.comments;
      if (typeof data[numInList].likes !== 'undefined') data[numInList].likes += 1;
      this.props.likeComment(commentId);
      this.setState({comments: {...this.state.comments, data}})
    }
    return addLikes.bind(this);
  }

  loadMore(page){
    this.props.fetchCommentsIfNeeded(page);
  }

  _loadItems(page) {
    const { location } = this.props;
    this.props.setCurrentPage(page);
    this.props.fetchStoriesIfNeeded(page);
    if (location !== undefined) {
      this.props.push({
        pathname: location.pathname,
        query: {page: this.props.page.current}
      });
    }
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


  renderCommentList() {
    const { comments } = this.state;
    let loader;
    if (
      !comments.readyStatus ||
      comments.readyStatus === FETCH_COMMENTS_INVALID ||
      comments.readyStatus === FETCH_COMMENTS_REQUESTING
    ) {
      loader = <div className="loader">Loading ...</div>;
    } else if (comments.readyStatus === FETCH_COMMENTS_FAILURE) {
      loader = <p>Oops, Failed to load items!</p>;
    }

    console.log(this.state.comments);
    const items = (
      <div>
        {this.state.comments.data.map((comment, numInList) => {
          console.log(comment.id);
          return (<CommentListItem
            numInList={numInList}
            commentId={comment.id}
            displayName={comment.display_name}
            avatarUrl={comment.avatar_url}
            content={comment.content}
            likes={comment.likes}
            onClickLike={this.onClickLike}
          />);
        })}
      </div>
    );
    console.log(items);
    return (
      (items === []) ?
        <div>
          <p>Uh oh, seems like there is no any items yet! Please add one :)</p>
        </div> :

        <InfiniteScroll
          page={this.props.page.current}
          hasMore={this.props.page.current < this.props.page.last}
          loadMore={this.loadItems}
          loader={loader}
          useWindow={false}
        >
          {items}
        </InfiniteScroll>

    );
  }

  render() {
    const { story, match: { params } } = this.props;
    const storyDetailById = story[params.id];
    console.log(params.id);
    console.log( storyDetailById);
    let storyDetailElement = <p>Loading...</p>;

    if (
      !storyDetailById ||
      storyDetailById.readyStatus === FETCH_STORY_REQUESTING
    ) {
      storyDetailElement = <p>Loading...</p>;
    } else if (storyDetailById.readyStatus === FETCH_STORY_FAILURE) {
      storyDetailElement = <p>Oops, Failed to load detail!</p>;
    } else if (storyDetailById.readyStatus === FETCH_STORY_SUCCESS) {
      const detail = storyDetailById.info;
      storyDetailElement =
        (<StoryDetailItem
          id={detail.id}
          title={detail.title}
          goal={detail.goal}
          limitation={detail.limitation}
        />);
    }

    const { onRemoveClick, text } = this.props;
    const { isEditable } = this.state;

    return (
      <div className={styles.pageContainer}>
        <div className={styles.storyListPage}>
          {storyDetailElement}
          <PostCommentForm storyId={params.id} />
          {this.renderCommentList()}
        </div>
      </div>

    );
  }
}


const mapStateToProps = ({ story, comments, role, location, routing, pagination, entity }: ReduxState) => {


  const { page, pages } = pagination.stories;

  /*
    const storyIds = Array.prototype.flatten(
      Object
        .keys(pages)
        .map(pageId => pages[pageId].ids)
    );
    console.log(storyIds);

    stories =  ("ids" in storyIds) ? storyIds.ids.map(id => entity.stories[id]) : [];

  */

  return {
    location,
    story,
    comments,
    page
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setSelectedStory: (id: number) => dispatch(setSelectedStory(id)),
  fetchCommentsIfNeeded: (id: number) => dispatch(fetchCommentsIfNeeded(id)),
  fetchStoryIfNeeded: (id: number) => dispatch(fetchStoryIfNeeded(id)),
  likeComment: (id: number) => dispatch(likeComment(id))
});

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

// Enable hot reloading for async component
export default compose(hot(module), withRouter, connector)(StoryDetail);
