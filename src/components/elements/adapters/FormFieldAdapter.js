import React from 'react';
import FormField from "../widgets/FormField";


const FormFieldAdapter = ({ input, meta, ...rest }) => (
  <FormField
    {...input}
    {... meta}
    {...rest}
    onChange={(event, value) => input.onChange(value)}
    errorText={meta.touched ? meta.error : ''}
  />
)

export default FormFieldAdapter
