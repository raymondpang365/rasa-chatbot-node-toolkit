import React, { PureComponent } from 'react';
import styles from '../../../styles/main.scss'

class BasicField extends PureComponent {

  render() {

    const { input, label, type, meta, ...rest } = this.props;

    return (
      <input
        type={type}
        autoComplete="off"
        value={input.value}
      />
    )
  }
}

export default BasicField;

