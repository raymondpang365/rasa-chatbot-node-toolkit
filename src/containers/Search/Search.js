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
  fetchBusinesses,
  fetchBusinessesIfNeeded
} from '../../actions/businesses';
import { setCurrentPage } from '../../actions/page';
import StoryListItem from '../../components/StoryListItem';
import InfiniteScroll from '../../components/utils/InfiniteScroll';
import styles from '../../styles/main.scss'
import Footer from '../../components/utils/Footer'
import SearchToolbar from './SearchToolbar'
import Calendar from '../../components/MyCalendar'

import {
  FETCH_BUSINESSES_SUCCESS,
  FETCH_BUSINESSES_FAILURE,
  FETCH_BUSINESSES_REQUESTING,
  FETCH_BUSINESSES_INVALID
} from "../../reducers/businesses";

import type {
  StoryList as StoryListType,
  Dispatch,
  ReduxState
} from '../../types/index';

type Props = {
  storyList: StoryListType,
  fetchBusinessesIfNeeded: () => void
};


class Search extends PureComponent {

  constructor(props) {
    super(props);
    this.loadItems = this._loadItems.bind(this);
    // this.handleAddClick = this._handleAddClick.bind(this);
    // this.handleRemoveClick = this._handleRemoveClick.bind(this);
    // this.handleSaveClick = this._handleSaveClick.bind(this);
    console.log('another fff');

    this.state = {
      businesses: {
        readyStatus: FETCH_BUSINESSES_INVALID,
        err: null,
        data: []
      }
    };
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    this.props.fetchBusinessesIfNeeded(this.props.match.params.page);
    console.log('hello');
  }

  componentWillReceiveProps(newProps){
    if(JSON.stringify(newProps.businesses) !== JSON.stringify(this.businesses) ){
      this.setState({businesses: newProps.businesses })
    }
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
    this.props.fetchBusinessesIfNeeded(page);
    if (location !== undefined) {
      this.props.push({
        pathname: location.pathname,
        query: {page: this.props.page.current}
      });
    }
  }

  renderStoryList() {
    const { businesses } = this.props;
    let loader;
    if (
      !businesses.readyStatus ||
      businesses.readyStatus === FETCH_BUSINESSES_INVALID ||
      businesses.readyStatus === FETCH_BUSINESSES_REQUESTING
    ) {
      loader = <div className="loader">Loading ...</div>;
    } else if (businesses.readyStatus === FETCH_BUSINESSES_FAILURE) {
      loader = <p>Oops, Failed to load items!</p>;
    }


    console.log(this.props.businesses);
    const items = (
      <div>
        {this.props.businesses.data.map((story, numInList) => {
          console.log(story.id);
          return (<StoryListItem
            numInList={numInList}
            storyId={story.id}
            displayName={story.display_name}
            avatarUrl={story.avatar_url}
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
    const { page } = this.props;
    console.log(page);
    return (
      <div className={styles.pageContainer}>

        <div className={styles.storyListPage}>
          <ErrorList />

          <Calendar />



          {this.renderStoryList()}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ location, businesses, pagination, entity }: ReduxState) => {


  const { page, pages } = pagination.businesses;

  /*
    const storyIds = Array.prototype.flatten(
      Object
        .keys(pages)
        .map(pageId => pages[pageId].ids)
    );
    console.log(storyIds);

    businesses =  ("ids" in storyIds) ? storyIds.ids.map(id => entity.businesses[id]) : [];

  */

  return {
    location,
    businesses,
    page
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (pathname, query) => dispatch(push(pathname, query)),
  fetchBusinessesIfNeeded: () => dispatch(fetchBusinessesIfNeeded()),
  setCurrentPage: page => dispatch(setCurrentPage('STORY', page))
});

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(hot(module), withRouter, connector)(Search);
