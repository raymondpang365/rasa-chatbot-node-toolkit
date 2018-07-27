export default apiEngine => ({
  // list: () => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(apiEngine.get('/api/vehicle'));
  //   }, 5000);
  // }),
  list: ({ page }) => {
    console.log(apiEngine.get);
    return apiEngine.get('/api/stories', {params: {page}})
  },
  check: (id) => {
    console.log(apiEngine.get);
    console.log(id);
    return apiEngine.get(`/api/stories/${id}`);
  },
  create: story => apiEngine.post('/api/stories', { data: story }),
  update: (id, story) =>
    apiEngine.put(`/api/stories/${id}`, { data: story }),
  remove: id => apiEngine.del(`/api/stories/${id}`)
});
