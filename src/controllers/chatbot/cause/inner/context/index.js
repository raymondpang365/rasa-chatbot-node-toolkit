import isVote from './isVote';
import asyncRoute from '../../../../../utils/asyncRoute'

export default asyncRoute(
  async (req,res) => {
    try {
      const { body } = req;
      console.log(body);

      let context = {};

      switch (body.context) {
        case 'is_vote':
          context = await isVote(body);
          break;
        default:
          break;
      }
      return res.json(context);


    }
    catch(err){
      if(!res.headersSent){
        res.status(500).json({
          message: err.toString()
        });
      }
      console.log(err.toString);
    }
  }
);

