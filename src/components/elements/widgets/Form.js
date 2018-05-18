import React, { PureComponent } from 'react';

class Form extends PureComponent {

  render() {
    const {
      children,
      ...rest
    } = this.props;

    return (
      <div className='form-wrap' {...rest}>
        {children}
      </div>
    );
  }
};

export default Form;
