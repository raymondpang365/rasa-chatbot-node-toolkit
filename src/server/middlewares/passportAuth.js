import passport from 'passport';

export default strategyName => (req, res, next) => {
  const state = JSON.parse(req.query.state);
  console.log(strategyName);
  console.log(state);
  if(state.env === "native"){
    console.log('bingo');
    return passport.authenticate(
      strategyName,
      {failureRedirect: `/auth/${strategyName}` }
      )(req, res, next)
  }
  else{
    return passport.authenticate(
      strategyName,
      {failureRedirect: '/user/login'}
      )(req, res, next)
  }
}
