import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import Text from '../elements/widgets/Text';

const style = {
  cursor: 'pointer',
  margin: 2
};

const handlePagerButtonClick = props => {
  const { disabled, onClick } = props;

  if (disabled) {
    return undefined;
  }
  return onClick;
};

const PagerButton = props => {
  /* eslint-disable */
  // consume prop `onClick`
  let { disabled, onClick, children, ...rest } = props;
  /* eslint-enable */

  return (
    <li className={cx({ disabled })} style={style} {...rest}>
      <Button onClick={handlePagerButtonClick(props)}>{children}</Button>
    </li>
  );
};

class Pager extends Component {
  constructor(props) {
    super(props);

    this.handlePageChange = this._handlePageChange.bind(this);
  }
  _handlePageChange(pageId) {
    const { onPageChange } = this.props;
    console.log(pageId);
    if (onPageChange === null) {
      // console.log(onPageChange);
      onPageChange(pageId);
    }
  }

  render() {
    const { simple, page } = this.props;
    const pageStatus = {
      isFirst: page.current === page.first,
      isLast: page.current === page.last
    };

    return (
      <nav>
        <ul className="pager">
          {!simple && (
            <PagerButton
              disabled={pageStatus.isFirst}
              onClick={this.handlePageChange(page.first)}
            >
              <i className="fa fa-angle-double-left" aria-hidden="true" />{' '}
              <Text id="page.first" />
            </PagerButton>
          )}

          <PagerButton
            disabled={pageStatus.isFirst}
            onClick={this.handlePageChange(page.current - 1)}
          >
            <i className="fa fa-chevron-left" aria-hidden="true" />{' '}
            <Text id="page.prev" />
          </PagerButton>

          <PagerButton
            disabled={pageStatus.isLast}
            onClick={this.handlePageChange(page.current + 1)}
          >
            <Text id="page.next" />{' '}
            <i className="fa fa-chevron-right" aria-hidden="true" />
          </PagerButton>

          {!simple && (
            <PagerButton
              disabled={pageStatus.isLast}
              onClick={this.handlePageChange(page.last)}
            >
              <Text id="page.last" />{' '}
              <i className="fa fa-angle-double-right" aria-hidden="true" />
            </PagerButton>
          )}
        </ul>
      </nav>
    );
  }
}

Pager.defaultProps = {
  simple: false,
  onPageChange: null
};

Pager.propTypes = {
  simple: PropTypes.bool,
  page: PropTypes.object.isRequired,
  onPageChange: PropTypes.func
};

export default connect()(Pager);
