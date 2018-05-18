export default apiEngine => ({
  // list: () => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(apiEngine.get('/api/statement'));
  //   }, 5000);
  // }),
  list: ({ page }) => apiEngine.get('/api/statements', { params: { page } }),
  create: statement => apiEngine.post('/api/statements', { data: statement }),
  update: (id, statement) =>
    apiEngine.put(`/api/statements/${id}`, { data: statement }),
  remove: id => apiEngine.del(`/api/statements/${id}`)
});
