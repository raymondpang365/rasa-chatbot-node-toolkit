/* @flow */

import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { push } from 'connected-react-router';
import ErrorList from '../../components/utils/ErrorList';
import { fetchMatchResults } from '../../actions/match';
import StoryListItem from '../../components/StoryListItem';
import InfiniteScroll from '../../components/utils/InfiniteScroll';
import styles from '../../styles/main.scss'
import Footer from '../../components/utils/Footer'
import MatchResultListItem from '../../components/MatchResultListItem'

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
  matchResult: () => void
};


class MatchResult extends PureComponent {

  constructor(props) {
    super(props);
    console.log('another fff');

    this.state = {
      matches: {
        readyStatus: MATCH_RESULT_INVALID,
        selected: 0,
        err: null,
        data: []
      }
    };
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    console.log(params.id);
    this.props.fetchMatchResults(1);
    console.log('hello');
  }

  componentWillReceiveProps(newProps){
    if(JSON.stringify(newProps.matches) !== JSON.stringify(this.matches) ){
      this.setState({matches: newProps.matches })
    }
  }

  renderMatchResultList() {
    const { matchResult } = this.props;
    let loader;
    if (
      !matchResult.readyStatus ||
      matchResult.readyStatus === MATCH_RESULT_INVALID ||
      matchResult.readyStatus === MATCH_RESULT_REQUESTING
    ) {
      loader = <div className="loader">Loading ...</div>;
    } else if (matchResult.readyStatus === MATCH_RESULT_FAILURE) {
      loader = <p>Oops, Failed to load items!</p>;
    }


    console.log(this.props.matchResult);
    const items = (
      <div>
        {this.props.matchResult.data.map((story, numInList) => {
          console.log(story.id);
          return (<MatchResultListItem
            numInList={numInList}
            matchId={story.id}
            score={story.score}
            imageUrl={story.image_url}
            displayName={story.display_name}
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
    return (
      <div className={styles.pageContainer}>
        <div className={styles.storyListPage}>
          <ErrorList />
          {this.renderMatchResultList()}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ location, matchResult, pagination,  selectMatch, entity }: ReduxState) => {


  const { page } = pagination.matchResult;

  console.log(matchResult);


  return {
    page,
    location,
    matchResult,
    selectMatch
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (pathname, query) => dispatch(push(pathname, query)),
  fetchMatchResults: (id) => dispatch(fetchMatchResults(id)),
});

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(hot(module), withRouter, connector)(MatchResult);
