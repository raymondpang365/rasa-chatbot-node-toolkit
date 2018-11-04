/* @flow */

import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { push } from 'connected-react-router';
import ErrorList from '../../components/utils/ErrorList';
import styles from '../../styles/main.scss'
import Footer from '../../components/utils/Footer'
import Calendar from '../../components/MyCalendar'
import { joinMatch, setSelectedMatch } from '../../actions/match';

import {
  JOIN_MATCH_SUCCESS,
  JOIN_MATCH_FAILURE,
  JOIN_MATCH_REQUESTING,
  JOIN_MATCH_INVALID
} from "../../reducers/match/joinMatch";

import type {
  StoryList as StoryListType,
  Dispatch,
  ReduxState
} from '../../types/index';

type Props = {
  storyList: StoryListType,
  fetchBusinessesIfNeeded: () => void
};


class Match extends PureComponent {

  constructor(props) {
    super(props);

    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    console.log('another fff');

    this.state = {
      businesses: {
        readyStatus: JOIN_MATCH_INVALID,
        search: '',
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
    this.props.setSelectedMatch(params.id);

    console.log('hello');
  }

  componentWillReceiveProps(newProps){
    if(JSON.stringify(newProps.businesses) !== JSON.stringify(this.businesses) ){
      this.setState({businesses: newProps.businesses })
    }
  }


  updateInput(event){
    this.setState({search: event.target.value})
  }


  handleSubmit(){
    const { selectMatch } = this.props;
    console.log(this.state.search);
    this.props.joinMatch(selectMatch.selected, this.state.search);
  }

/*
  handleSubmit(){
    const { selectMatch } = this.props;
    console.log(this.state.search);
    this.props.joinMatch(selectMatch.selected, this.state.search);
  }
  */

  render() {
    const { page } = this.props;
    console.log(page);
    return (
      <div className={styles.pageContainer}>

        <div className={styles.storyListPage}>
          <ErrorList />
          <Calendar />
          <div className={styles.matchField}>
            Preference: <input type="text" onChange={this.updateInput} />
          </div>
          <button className={styles.btnGreen} onClick={this.handleSubmit}>
            Go
          </button>

        </div>
        <Footer />
      </div>
  );
  }
}

const mapStateToProps = ({ location, businesses, pagination, selectMatch }: ReduxState) => {

  const { page } = pagination.businesses;


  return {
    location,
    businesses,
    page,
    selectMatch
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setSelectedMatch: (id: number) => dispatch(setSelectedMatch(id)),
  push: (pathname, query) => dispatch(push(pathname, query)),
  joinMatch: (id, keywords) => dispatch(joinMatch(id, keywords))
});

const connector: Connector<{}, Props> = connect(
mapStateToProps,
mapDispatchToProps
);

export default compose(hot(module), withRouter, connector)(Match);
