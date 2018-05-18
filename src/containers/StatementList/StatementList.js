/* @flow */

import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { push } from 'react-router-redux';
import ErrorList from '../../components/utils/ErrorList';
import {
  createStatement,
  updateStatement,
  removeStatement,
  fetchStatements,
  fetchStatementsIfNeeded
} from '../../actions/statements';
import { setCrrentPage } from '../../actions/page';
import StatementListCard from '../../components/StatementListCard/index';
import InfiniteScroll from '../../components/utils/InfiniteScroll';
import styles from '../../styles/main.scss'

import type {
  StatementList as StatementListType,
  Dispatch,
  ReduxState
} from '../../types/index';

type Props = {
  statementList: StatementListType,
  fetchStatementsIfNeeded: () => void
};


class StatementList extends PureComponent {

  constructor(props) {
    super(props);
    this.loadItems = this._loadItems.bind(this);
    this.handleAddClick = this._handleAddClick.bind(this);
    this.handleRemoveClick = this._handleRemoveClick.bind(this);
    this.handleSaveClick = this._handleSaveClick.bind(this);
    console.log('another fff');
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    this.props.fetchStatementsIfNeeded(this.props.match.params.page);
    console.log('hello');
  }

  _handleAddClick() {
    const text = this.statementtext.value;
    console.log(text);
    this.props.createStatement(text).then(() => {
      this.statementtext.value = '';
    });

  }

  _handleSaveClick(id, newText) {
    this.props.updateStatement(id, newText);
  }

  _handleRemoveClick(id) {
    this.props.removeStatement(id);
  }

  _loadItems(page) {
    const { location } = this.props;
    this.props.setCrrentPage(page);
    this.props.fetchStatementsIfNeeded(page);
    if (location !== undefined) {
      this.props.push({
        pathname: location.pathname,
        query: {page: this.props.page.current}
      });
    }
  }

  renderStatementList() {
    const { statementList } = this.props;
    let loader;
    if (
      !statementList.readyStatus ||
      statementList.readyStatus === 'STATEMENTS_INVALID' ||
      statementList.readyStatus === 'STATEMENTS_REQUESTING'
    ) {
      loader = <div className="loader">Loading ...</div>;
    } else if (statementList.readyStatus === 'STATEMENTS_FAILURE') {
      loader = <p>Oops, Failed to load items!</p>;
    }

    const items = [];
    this.props.statements.map(statement => {
      items.push(
        <StatementListCard
          statement={statement._id}
          onRemoveClick={this.handleRemoveClick(statement._id)}
          onSaveClick={this.handleSaveClick(statement._id)}
          name={statement.text}
        />
      );
    });
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
      >
        <div className="tracks">{items}</div>
      </InfiniteScroll>
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
            Statement List ({`${page.current} / ${page.total}`})
          </h3>
          <input
            disabled={false}
            type="text"
            ref={c => {
              this.statementtext = c;
            }}
          />
          <button
            className={styles.btnBlue}
            disabled={false}
            onClick={this.handleAddClick}
          >
            Add Statement
          </button>
          {page.current !== 1 && (
            <div>The input box is only available for page 1</div>
          )}
          {this.renderStatementList()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ location, statementList, pagination, entity }: ReduxState) => {
  const { page, pages } = pagination.statements;
  const statementIds = Array.prototype.flatten(
    Object
      .keys(pages)
      .map(pageId => pages[pageId].ids)
  );

  const statements =  ("ids" in statementIds) ? statementIds.ids.map(id => entity.statements[id]) : [];

  return {
    location,
    statementList,
    statements,
    page
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (pathname, query) => dispatch(push(pathname, query)),
  createStatement: text => dispatch(createStatement(text)),
  updateStatement: (id, text) => dispatch(updateStatement(id, text)),
  removeStatement: id => dispatch(removeStatement(id)),
  fetchStatementsIfNeeded: () => dispatch(fetchStatementsIfNeeded()),
  setCrrentPage: page => dispatch(setCrrentPage('STATEMENT', page))
});

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(hot(module), withRouter, connector)(StatementList);
