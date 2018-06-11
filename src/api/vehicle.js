export default apiEngine => ({
  // list: () => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(apiEngine.get('/api/vehicle'));
  //   }, 5000);
  // }),
  list: ({ page }) => apiEngine.get('/api/vehicles', { params: { page } }),
  create: vehicle => apiEngine.post('/api/vehicles', { data: vehicle }),
  update: (id, vehicle) =>
    apiEngine.put(`/api/vehicles/${id}`, { data: vehicle }),
  remove: id => apiEngine.del(`/api/vehicles/${id}`)
});
