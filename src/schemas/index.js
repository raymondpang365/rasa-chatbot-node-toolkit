import { schema } from 'normalizr';

export const storySchema = new schema.Entity(
  'stories',
  {},
  {
    idAttribute: '_id'
  }
);

export const arrayOfStory = new schema.Array(storySchema);

export const businessSchema = new schema.Entity(
  'businesses',
  {},
  {
    idAttribute: '_id'
  }
);

export const arrayOfBusiness = new schema.Array(businessSchema);

export const userSchema = new schema.Entity(
  'users',
  {},
  {
    idAttribute: '_id'
  }
);
