export default apiEngine => ({
  // list: () => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(apiEngine.get('/api/vehicle'));
  //   }, 5000);
  // }),
  list: ({ page }) => {
    console.log(apiEngine.get);
    return apiEngine.get('/api/businesses', {params: {page}})
  },
  check: (id) => {
    console.log(apiEngine.get);
    console.log(id);
    return apiEngine.get(`/api/businesses/${id}`);
  },
  create: story => apiEngine.post('/api/businesses', { data: story }),
  update: (id, story) =>
    apiEngine.put(`/api/businesses/${id}`, { data: story }),
  remove: id => apiEngine.del(`/api/businesses/${id}`)
});
