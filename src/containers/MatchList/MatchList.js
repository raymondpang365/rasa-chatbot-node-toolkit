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
  fetchMatchesIfNeeded,
  createMatch
} from '../../actions/match';
import MatchListItem from '../../components/MatchListItem';
import InfiniteScroll from '../../components/utils/InfiniteScroll';
import styles from '../../styles/main.scss'
import Footer from '../../components/utils/Footer'

import {
  FETCH_MATCHES_SUCCESS,
  FETCH_MATCHES_FAILURE,
  FETCH_MATCHES_REQUESTING,
  FETCH_MATCHES_INVALID
} from "../../reducers/match/fetchMatches";

import type {
  MatchList as MatchListType,
  Dispatch,
  ReduxState
} from '../../types/index';

type Props = {
  matchList: MatchListType,
  fetchMatchesIfNeeded: () => void
};


class MatchList extends PureComponent {

  constructor(props) {
    super(props);
    this.loadItems = this._loadItems.bind(this);
    this.handleAddClick = this._handleAddClick.bind(this);

    console.log('another fff');

    this.state = {
      matches: {
        readyStatus: FETCH_MATCHES_INVALID,
        err: null,
        data: []
      }
    };
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    console.log(this.props.match.params.page);
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

  _handleAddClick() {
    this.props.createMatch();
  }

  renderMatchList() {
    const { matches } = this.props;
    let loader;
    if (
      !matches.readyStatus ||
      matches.readyStatus === FETCH_MATCHES_INVALID ||
      matches.readyStatus === FETCH_MATCHES_REQUESTING
    ) {
      loader = <div className="loader">Loading ...</div>;
    } else if (matches.readyStatus === FETCH_MATCHES_FAILURE) {
      loader = <p>Oops, Failed to load items!</p>;
    }
    console.log(this.props.matches);
    const items = (
      <div>
        {this.props.matches.data.map((match, numInList) => {
          console.log(match.id);
          return (<MatchListItem
            numInList={numInList}
            matchId={match.id}
            displayName={match.display_name}
            avatarUrl={match.avatar_url}
            title={match.title}
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
          <button
            className={styles.btnBlue}
            disabled={false}
            onClick={this.handleAddClick}
          >
            Add Event
          </button>

          {this.renderMatchList()}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ location, matches, pagination, entity }: ReduxState) => {


  const { page, pages } = pagination.matches;

  return {
    location,
    matches,
    page
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (pathname, query) => dispatch(push(pathname, query)),
  fetchMatchesIfNeeded: () => dispatch(fetchMatchesIfNeeded()),
  createMatch: () => dispatch(createMatch())

});

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(hot(module), withRouter, connector)(MatchList);
