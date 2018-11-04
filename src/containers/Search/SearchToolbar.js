import React, { Button,  PureComponent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from '../../styles/main.scss';



import TagFilter from './TagFilter';
import ScorePanel from './ScorePanel';
import SpecialSearch from './SpecialSearch';
import Budget from './Budget';
import Location from './Location';

const cx = classNames.bind(styles);

function Panel({children, id, isInvisible}) {
  // const { panel, invisible } = styles;
  const panelClass = isInvisible? classNames(`${styles.panel}`,`${styles.invisible}`) :
  classNames(`${styles.panel}`);


  return <div id={id} className={panelClass}>{children}</div>
}

class NavigationBar extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectedTool: 'NONE'
    };
    this.toggleTool = this.toggleTool.bind(this);
  }



  toggleTool(toolName){

    console.log('toggle');
    this.setState({selectedTool: toolName});


  };


  render() {
    const { selectedTool } = this.state;

    return(
      <div className={styles.searchToolbarContainer}>
        <Panel id="TAG_FILTER" isInvisible={selectedTool !== 'TAG_FILTER'}>
          <h4>Filter:</h4>
          <input type="text" name="filter1" />
          <input type="text" name="filter2" />
          <input type="text" name="filter3" />
          <input type="text" name="filter4" />
        </Panel>
        <Panel id="SCORE_PANEL" isInvisible={selectedTool !== 'SCORE_PANEL'}>
          <h4>Ambiance:</h4>
          <input type="text" name="ambiance" />
          <h4>Hygiene:</h4>
          <input type="text" name="hygiene" />
          <h4>Specialness:</h4>
          <input type="text" name="specialness" />
          <h4>Food:</h4>
          <input type="text" name="food" />
        </Panel>
        <Panel id="SPECIAL_SEARCH" isInvisible={selectedTool !== 'SPECIAL_SEARCH'}>
          Enable Personal Match:
          <input type="checkbox" name="enableMatch" />
        </Panel>
        <Panel id="BUDGET" isInvisible={selectedTool !== 'BUDGET'}>
          <input type="text" name="fromAmount" />
          <input type="text" name="toAmount" />

        </Panel>
        <Panel id="LOCATION" isInvisible={selectedTool !== 'LOCATION'}>
          <h4>Nearby</h4>
          <input type="checkbox" name="isNearby" />
          <h4>Parking</h4>
          <input type="checkbox" name="hasCarpark" />
          <h4>District:</h4>
          <input type="text" name="district" />
          <h4>Ambiance:</h4>
          <input type="text" name="ambiance" />

        </Panel>

        <footer className={styles.searchToolbar}>
          <button className={styles.toolbarButton} onClick={()=>this.toggleTool('TAG_FILTER')} >
            <div className={styles.header__icon} id={styles.header__icon} />
            <h4> Tag Filter </h4>
          </button>
          <button  className={styles.toolbarButton} onClick={()=>this.toggleTool('SCORE_PANEL')} >
            <div className={styles.header__icon} id={styles.header__icon} />
            <h4> Score Filter </h4>
          </button>
          <button className={styles.toolbarButton} onClick={()=>this.toggleTool('SPECIAL_SEARCH')} >
            <div className={styles.header__icon} id={styles.header__icon} />

          </button>
          <button className={styles.toolbarButton} onClick={()=>this.toggleTool('BUDGET')} >
            <div className={styles.header__icon} id={styles.header__icon} />
            <h4> Budget </h4>
          </button>
          <button className={styles.toolbarButton} onClick={()=>this.toggleTool('LOCATION')} >
            <div className={styles.header__icon} id={styles.header__icon} />
            <h4> Location </h4>
          </button>
        </footer>
      </div>

    );
  }
};

export default connect(({ router, cookies: { token, user } }) => ({
  router,
  isAuth: !!token,
  user: user || {},
}), null, null, {
  pure: false,
})(NavigationBar);
