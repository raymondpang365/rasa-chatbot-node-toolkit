import React from 'react';
import TextArea from "../widgets/TextArea";

const TextAreaAdapter = ({ input, meta, ...rest }) => (
  <TextArea
    {...input}
    {... meta}
    {...rest}
    onChange={(event, value) => input.onChange(value)}
    errorText={meta.touched ? meta.error : ''}
  />
)

export default TextAreaAdapter
