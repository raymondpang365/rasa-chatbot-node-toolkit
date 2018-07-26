export default apiEngine => ({
  // list: () => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(apiEngine.get('/api/vehicle'));
  //   }, 5000);
  // }),
  list: ({ page }) => apiEngine.get('/api/comments', { params: { page } }),
  create: story => apiEngine.post('/api/comments', { data: story }),
  update: (id, story) =>
    apiEngine.put(`/api/comments/${id}`, { data: story }),
  remove: id => apiEngine.del(`/api/comments/${id}`)
});
