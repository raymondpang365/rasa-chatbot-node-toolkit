export const propValueArray = (obj, keyName) => {
  return obj.map(a => a[`${keyName}`]);
};
