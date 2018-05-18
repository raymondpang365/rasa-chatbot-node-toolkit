import TextField from 'material-ui/TextField'
import React from 'react';

const TextFieldAdapter = ({ input, meta, ...rest }) => (
  <TextField
    {...input}
    {...meta}
    {...rest}
    onChange={(event, value) => input.onChange(value)}
    errorText={meta.touched ? meta.error : ''}
  />
)

export default TextFieldAdapter
