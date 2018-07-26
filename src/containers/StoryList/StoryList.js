/* @flow */

import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { push } from 'connected-react-router';
import ErrorList from '../../components/utils/ErrorList';
import {
  createStory,
  updateStory,
  removeStory,
  fetchStories,
  fetchStoriesIfNeeded
} from '../../actions/stories';
import { setCurrentPage } from '../../actions/page';
import StoryListItem from './StoryListItem';
import InfiniteScroll from '../../components/utils/InfiniteScroll';
import styles from '../../styles/main.scss'

import type {
  StoryList as StoryListType,
  Dispatch,
  ReduxState
} from '../../types/index';

type Props = {
  storyList: StoryListType,
  fetchStoriesIfNeeded: () => void
};


class StoryList extends PureComponent {

  constructor(props) {
    super(props);
    this.loadItems = this._loadItems.bind(this);
    // this.handleAddClick = this._handleAddClick.bind(this);
    // this.handleRemoveClick = this._handleRemoveClick.bind(this);
    // this.handleSaveClick = this._handleSaveClick.bind(this);
    console.log('another fff');
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    this.props.fetchStoriesIfNeeded(this.props.match.params.page);
    console.log('hello');
  }
/*
  _handleAddClick() {
    const text = this.storytext.value;
    console.log(text);
    this.props.createStory(text).then(() => {
      this.storytext.value = '';
    });

  }

  _handleSaveClick(id, newText) {
    this.props.updateStory(id, newText);
  }

  _handleRemoveClick(id) {
    this.props.removeStory(id);
  }
  */

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

  renderStoryList() {
    const { stories } = this.props;
    let loader;
    if (
      !stories.readyStatus ||
      stories.readyStatus === 'FETCH_STORIES_INVALID' ||
      stories.readyStatus === 'FETCH_STORIES_REQUESTING'
    ) {
      loader = <div className="loader">Loading ...</div>;
    } else if (stories.readyStatus === 'FETCH_STORIES_FAILURE') {
      loader = <p>Oops, Failed to load items!</p>;
    }


    console.log(this.props.stories);
    const items = (
      <div>
        {this.props.stories.data.map(story => {
          console.log(story.id);
          return (<StoryListItem
            id={story.id}
            title={story.title}
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
      <div className={styles.infinite_scroll}>
        <InfiniteScroll
          page={this.props.page.current}
          hasMore={this.props.page.current < this.props.page.last}
          loadMore={this.loadItems}
          loader={loader}
          useWindow={false}
        >
          {items}
        </InfiniteScroll>
      </div>
    );
  }

  render() {
    const { page } = this.props;
    console.log(page);
    return (
      <div className={styles.siteContent}>
        <div className={styles.container}>
          <ErrorList />
          <h3 className={styles.h6}>
            Story List ({`${page.current} / ${page.total}`})
          </h3>
          <input
            disabled={false}
            type="text"
            ref={c => {
              this.storytext = c;
            }}
          />
          <button
            className={styles.btnBlue}
            disabled={false}
            onClick={this.handleAddClick}
          >
            Add Story
          </button>
          {page.current !== 1 && (
            <div>The input box is only available for page 1</div>
          )}


          {this.renderStoryList()}

        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ location, stories, pagination, entity }: ReduxState) => {


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
    stories,
    page
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (pathname, query) => dispatch(push(pathname, query)),
  fetchStoriesIfNeeded: () => dispatch(fetchStoriesIfNeeded()),
  setCurrentPage: page => dispatch(setCurrentPage('STORY', page))
});

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(hot(module), withRouter, connector)(StoryList);
