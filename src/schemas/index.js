import { schema } from 'normalizr';

export const vehicleSchema = new schema.Entity(
  'vehicles',
  {},
  {
    idAttribute: '_id'
  }
);

export const arrayOfVehicle = new schema.Array(vehicleSchema);

export const userSchema = new schema.Entity(
  'users',
  {},
  {
    idAttribute: '_id'
  }
);
