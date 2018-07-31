const querystring = require('querystring');

export default apiEngine => ({
  // list: () => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(apiEngine.get('/api/vehicle'));
  //   }, 5000);
  // }),
  list: (storyId ) => {
    console.log(storyId);
    return apiEngine.get('/api/comments', { params: {storyId }})
  },
  create: (storyId, content) => {
    console.log(storyId);
    console.log(content);
    return apiEngine.post('/api/comments', {data: {storyId, content}})
  },
  addLikes:(id) => {
    apiEngine.put(`/api/comments/addlikes/${id}`)
  },
  update: (id, comment) =>
    apiEngine.put(`/api/comments/${id}`, { data: comment }),
  remove: id => apiEngine.del(`/api/comments/${id}`)
});
