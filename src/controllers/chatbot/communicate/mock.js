import userInitChat from '../initiate/outer/user';

const mockSendMessage = async payload => {
  const responseMessage = await userInitChat(payload);
}


export default {
  list(req, res) {
    // console.log(req);
    let comments;
    p.query('SELECT * FROM comment WHERE story_id = $1', [req.query.storyId]).then(
      results => {
        comments = results.rows;
        const userDetailsFetch = [];
        comments.map(({user_id}) =>
          userDetailsFetch.push(p.query('SELECT display_name, avatar_url FROM user_info WHERE user_id = $1', [user_id]))
        );
        return Promise.all(userDetailsFetch);
      }
    ).then(results => {
      const detailComments = comments.map((c, i) => Object.assign({}, c, results[i].rows[0]));
      res.json({ comments: detailComments} )
    })

  },
}
