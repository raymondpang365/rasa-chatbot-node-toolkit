export default apiEngine => ({
  createMatch: () => {
    console.log(apiEngine.get);
    return apiEngine.get('/api/match/create')
  },
  joinMatch: ( id, keywords  ) => {
    console.log(apiEngine.get);
    console.log(id);
    console.log(keywords);
    return apiEngine.get(`/api/match/join/${id}`, { params: {keywords} })

  },
  matchResult: ( id ) => {
    console.log(apiEngine.get);
    console.log(id);
    return apiEngine.get(`/api/matches/result/${id}`)

  },
  list: ({ page }) => {
    console.log(apiEngine.get);
    return apiEngine.get('/api/match', {params: {page}})
  }
});
