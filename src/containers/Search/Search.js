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
import searchDispatch from "../../actions/search";
import StoryListItem from '../../components/StoryListItem';
import InfiniteScroll from '../../components/utils/InfiniteScroll';
import styles from '../../styles/main.scss'
import Footer from '../../components/utils/Footer'
import SearchToolbar from './SearchToolbar'
import Calendar from '../../components/MyCalendar'


import {
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  SEARCH_REQUESTING,
  SEARCH_INVALID
} from "../../reducers/search";

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

    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    console.log('another fff');

    this.state = {
      search: {
        readyStatus: SEARCH_INVALID,
        err: null,
        data: []
      }
    };
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {

    console.log('hello');
  }

  componentWillReceiveProps(newProps){
    if(JSON.stringify(newProps.search) !== JSON.stringify(this.search) ){
      this.setState({search: newProps.search })
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
    this.props.searchIfNeeded(page);
    if (location !== undefined) {
      this.props.push({
        pathname: location.pathname,
        query: {page: this.props.page.current}
      });
    }
  }

  updateInput(event){
    this.setState({search: event.target.value})
  }


  handleSubmit(){
    console.log(this.state.search);
    this.props.searchDispatch(this.state.search);
  }


  renderStoryList() {
    const { search } = this.props;
    let loader;
    if (
      !search.readyStatus ||
      search.readyStatus === SEARCH_INVALID ||
      search.readyStatus === SEARCH_REQUESTING
    ) {
      loader = <div className="loader">Loading ...</div>;
    } else if (search.readyStatus === SEARCH_FAILURE) {
      loader = <p>Oops, Failed to load items!</p>;
    }


    console.log(this.props.search);
    const items = (
      <div>
        {this.props.search.data.map((business, numInList) => {
          console.log(business.id);
          return (<StoryListItem
            numInList={numInList}
            storyId={business.id}
            displayName={business.display_name}
            avatarUrl={business.avatar_url}
            title={business.title}
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
          <div className={styles.matchField}>
            Preference: <input type="text" onChange={this.updateInput} />
          </div>
          <button className={styles.btnGreen} onClick={this.handleSubmit}>
            Go
          </button>



          {this.renderStoryList()}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ location, businesses, pagination, entity, search }: ReduxState) => {


  const { page, pages } = pagination.search;

  /*
    const storyIds = Array.prototype.flatten(
      Object
        .keys(pages)
        .map(pageId => pages[pageId].ids)
    );
    console.log(storyIds);

    businesses =  ("ids" in storyIds) ? storyIds.ids.map(id => entity.businesses[id]) : [];

  */
  console.log(search);

  return {
    location,
    businesses,
    page,
    search
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (pathname, query) => dispatch(push(pathname, query)),
  searchDispatch: () => dispatch(searchDispatch()),
  setCurrentPage: page => dispatch(setCurrentPage('SEARCH', page))
});

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(hot(module), withRouter, connector)(Search);
