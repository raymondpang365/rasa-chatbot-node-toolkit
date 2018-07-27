export default apiEngine => ({
  // list: () => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(apiEngine.get('/api/vehicle'));
  //   }, 5000);
  // }),
  list: ({ storyId }) => apiEngine.get('/api/comments', { params: { storyId } }),
  create: comment => apiEngine.post('/api/comments', { data: comment }),
  update: (id, comment) =>
    apiEngine.put(`/api/comments/${id}`, { data: comment }),
  remove: id => apiEngine.del(`/api/comments/${id}`)
});
