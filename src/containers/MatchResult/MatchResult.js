/* @flow */

import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { push } from 'connected-react-router';
import ErrorList from '../../components/utils/ErrorList';
import { matchResult, fetchMatchesIfNeeded } from '../../actions/match';
import StoryListItem from '../../components/StoryListItem';
import InfiniteScroll from '../../components/utils/InfiniteScroll';
import styles from '../../styles/main.scss'
import Footer from '../../components/utils/Footer'
import MatchListItem from '../../components/MatchListItem'

import {
  MATCH_RESULT_SUCCESS,
  MATCH_RESULT_FAILURE,
  MATCH_RESULT_REQUESTING,
  MATCH_RESULT_INVALID
} from "../../reducers/match/matchResult";

import type {
  StoryList as StoryListType,
  Dispatch,
  ReduxState
} from '../../types/index';

type Props = {
  storyList: StoryListType,
  fetchMatchesIfNeeded: () => void
};


class MatchResult extends PureComponent {

  constructor(props) {
    super(props);
    this.loadItems = this._loadItems.bind(this);
    // this.handleAddClick = this._handleAddClick.bind(this);
    // this.handleRemoveClick = this._handleRemoveClick.bind(this);
    // this.handleSaveClick = this._handleSaveClick.bind(this);
    console.log('another fff');

    this.state = {
      matches: {
        readyStatus: MATCH_RESULT_INVALID,
        err: null,
        data: []
      }
    };
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    this.props.fetchMatchesIfNeeded(this.props.match.params.page);
    console.log('hello');
  }

  componentWillReceiveProps(newProps){
    if(JSON.stringify(newProps.matches) !== JSON.stringify(this.matches) ){
      this.setState({matches: newProps.matches })
    }
  }

  _loadItems(page) {
    const { location } = this.props;
    this.props.setCurrentPage(page);
    this.props.fetchMatchesIfNeeded(page);
    if (location !== undefined) {
      this.props.push({
        pathname: location.pathname,
        query: {page: this.props.page.current}
      });
    }
  }

  renderStoryList() {
    const { matches } = this.props;
    let loader;
    if (
      !matches.readyStatus ||
      matches.readyStatus === MATCH_RESULT_INVALID ||
      matches.readyStatus === MATCH_RESULT_REQUESTING
    ) {
      loader = <div className="loader">Loading ...</div>;
    } else if (matches.readyStatus === MATCH_RESULT_FAILURE) {
      loader = <p>Oops, Failed to load items!</p>;
    }


    console.log(this.props.matches);
    const items = (
      <div>
        {this.props.matches.data.map((story, numInList) => {
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
          <MatchListItem
            numInList={1}
            storyId={1}
            displayName="Grey Hound"
            title="87%"
          />
          <MatchListItem
            numInList={1}
            storyId={1}
            displayName="The Den"
            title="83%"
          />
          <MatchListItem
            numInList={1}
            storyId={1}
            displayName="Pizza Express"
            title="75%"
          />
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ location, matches, pagination, entity }: ReduxState) => {


  const { page, pages } = pagination.matches;

  /*
    const storyIds = Array.prototype.flatten(
      Object
        .keys(pages)
        .map(pageId => pages[pageId].ids)
    );
    console.log(storyIds);

    matches =  ("ids" in storyIds) ? storyIds.ids.map(id => entity.matches[id]) : [];

  */

  return {
    location,
    matches,
    page
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (pathname, query) => dispatch(push(pathname, query)),
  matchResult: () => dispatch(matchResult()),
  fetchMatchesIfNeeded:  () => dispatch(fetchMatchesIfNeeded()),
});

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(hot(module), withRouter, connector)(MatchResult);
