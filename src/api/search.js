export default apiEngine => ({
  // list: () => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(apiEngine.get('/api/vehicle'));
  //   }, 5000);
  // }),
  search: (criteria) => {
    console.log(criteria);
    return apiEngine.post('/api/search', {data: criteria})
  }
});
