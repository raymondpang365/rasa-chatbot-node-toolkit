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
  createVehicle,
  updateVehicle,
  removeVehicle,
  fetchVehicles,
  fetchVehiclesIfNeeded
} from '../../actions/vehicles';
import { setCrrentPage } from '../../actions/page';
import VehicleListCard from '../../components/VehicleListCard/index';
import InfiniteScroll from '../../components/utils/InfiniteScroll';
import styles from '../../styles/main.scss'

import type {
  VehicleList as VehicleListType,
  Dispatch,
  ReduxState
} from '../../types/index';

type Props = {
  vehicleList: VehicleListType,
  fetchVehiclesIfNeeded: () => void
};


class VehicleList extends PureComponent {

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
    this.props.fetchVehiclesIfNeeded(this.props.match.params.page);
    console.log('hello');
  }

  _handleAddClick() {
    const text = this.vehicletext.value;
    console.log(text);
    this.props.createVehicle(text).then(() => {
      this.vehicletext.value = '';
    });

  }

  _handleSaveClick(id, newText) {
    this.props.updateVehicle(id, newText);
  }

  _handleRemoveClick(id) {
    this.props.removeVehicle(id);
  }

  _loadItems(page) {
    const { location } = this.props;
    this.props.setCrrentPage(page);
    this.props.fetchVehiclesIfNeeded(page);
    if (location !== undefined) {
      this.props.push({
        pathname: location.pathname,
        query: {page: this.props.page.current}
      });
    }
  }

  renderVehicleList() {
    const { vehicleList } = this.props;
    let loader;
    if (
      !vehicleList.readyStatus ||
      vehicleList.readyStatus === 'VEHICLES_INVALID' ||
      vehicleList.readyStatus === 'VEHICLES_REQUESTING'
    ) {
      loader = <div className="loader">Loading ...</div>;
    } else if (vehicleList.readyStatus === 'VEHICLES_FAILURE') {
      loader = <p>Oops, Failed to load items!</p>;
    }

    const items = [];
    this.props.vehicles.map(vehicle => {
      items.push(
        <VehicleListCard
          vehicle={vehicle._id}
          onRemoveClick={this.handleRemoveClick(vehicle._id)}
          onSaveClick={this.handleSaveClick(vehicle._id)}
          name={vehicle.text}
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
            Vehicle List ({`${page.current} / ${page.total}`})
          </h3>
          <input
            disabled={false}
            type="text"
            ref={c => {
              this.vehicletext = c;
            }}
          />
          <button
            className={styles.btnBlue}
            disabled={false}
            onClick={this.handleAddClick}
          >
            Add Vehicle
          </button>
          {page.current !== 1 && (
            <div>The input box is only available for page 1</div>
          )}
          {this.renderVehicleList()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ location, vehicleList, pagination, entity }: ReduxState) => {
  const { page, pages } = pagination.vehicles;
  const vehicleIds = Array.prototype.flatten(
    Object
      .keys(pages)
      .map(pageId => pages[pageId].ids)
  );

  const vehicles =  ("ids" in vehicleIds) ? vehicleIds.ids.map(id => entity.vehicles[id]) : [];

  return {
    location,
    vehicleList,
    vehicles,
    page
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (pathname, query) => dispatch(push(pathname, query)),
  createVehicle: text => dispatch(createVehicle(text)),
  updateVehicle: (id, text) => dispatch(updateVehicle(id, text)),
  removeVehicle: id => dispatch(removeVehicle(id)),
  fetchVehiclesIfNeeded: () => dispatch(fetchVehiclesIfNeeded()),
  setCrrentPage: page => dispatch(setCrrentPage('VEHICLE', page))
});

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(hot(module), withRouter, connector)(VehicleList);
