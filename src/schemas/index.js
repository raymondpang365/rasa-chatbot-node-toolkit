import { schema } from 'normalizr';

export const statementSchema = new schema.Entity(
  'statements',
  {},
  {
    idAttribute: '_id'
  }
);

export const arrayOfStatement = new schema.Array(statementSchema);

export const userSchema = new schema.Entity(
  'users',
  {},
  {
    idAttribute: '_id'
  }
);
