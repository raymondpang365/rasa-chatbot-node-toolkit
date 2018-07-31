import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../styles/main.scss'

const classNames = require('classnames');

class TextArea extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };
  };

  getStyles(){
    const { value, invalid } = this.props;

    console.log([value, invalid]);

    const style = {
      inputStyle: classNames(`${styles.input}`),
      hrStyle: ''
    };

    console.log(value);
    if (!this.state.isFocused && value==="") {

      return {
        inputStyle: classNames(`${styles.input}`),
        hrStyle: ''
      }
    }
    else {
      if (invalid) {
        return {
          inputStyle: classNames(`${styles.input}`, `${styles.active}`, `${styles.invalid}`),
          hrStyle: classNames(`${styles.active}`)
        }
      };
      return {
        inputStyle: classNames(`${styles.input}`, `${styles.active}`, `${styles.valid}`),
        hrStyle: classNames(`${styles.active}`)
      };

    }
  }



  handleInputBlur = (event) => {
    this.setState({isFocused: false});
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  handleInputChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event, event.target.value);
    }
  };

  handleInputFocus = (event) => {
    if (this.props.disabled) {
      return;
    }
    this.setState({isFocused: true});
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  render(){

    const { inputStyle, hrStyle } = this.getStyles();
    const { floatingLabelText, type, name } = this.props;

    console.log(inputStyle);

    return (
      <div className={styles.addStoryFormField}>
        <div className={inputStyle} />
        <label className={styles.addStoryFormFieldLabel} htmlFor="mail">{floatingLabelText}</label>
        <textarea
          rows="4"
          cols="80"
          type={type}
          name={name}
          spellCheck="false"
          onBlur={this.handleInputBlur}
          onFocus={this.handleInputFocus}
          onChange={this.handleInputChange}
        />
      </div>
    )
  }
}

TextArea.propTypes = {
  /**
   * This property helps users to fill forms faster, especially on mobile devices.
   * The name can be confusing, as it's more like an autofill.
   * You can learn more about it here:
   * https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
   */

  /**
   * @ignore
   */
  onBlur: PropTypes.func,
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value`.
   */
  onChange: PropTypes.func,
  /**
   * @ignore
   */
  onFocus: PropTypes.func,
  /**
   * The short hint displayed in the input before the user enters a value.
   */
};

export default TextArea;
