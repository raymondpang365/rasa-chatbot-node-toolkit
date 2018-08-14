import React from 'react';
import BudgetInput from "../widgets/BudgetInput";


const BudgetInputAdapter = ({ input, meta, ...rest }) => (
  <BudgetInput
    {...input}
    {... meta}
    {...rest}
    onChange={(event, value) => input.onChange(value)}
    errorText={meta.touched ? meta.error : ''}
  />
)

export default BudgetInputAdapter
