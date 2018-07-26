import { schema } from 'normalizr';

export const storySchema = new schema.Entity(
  'stories',
  {},
  {
    idAttribute: '_id'
  }
);

export const arrayOfStory = new schema.Array(storySchema);

export const userSchema = new schema.Entity(
  'users',
  {},
  {
    idAttribute: '_id'
  }
);
