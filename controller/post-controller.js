const pool = require('../db/connect-mysql').pool;

const postController = {
  uploadPost: async (req, res, next) => {
    try {
      const [content, photo] = [req.body.content, req.files[0]];

      if (photo === undefined) {
        req.flash('message', {'info' : '사진은 반드시 작성해야 합니다'});
        return res.redirect('/');
      }

      await pool.query(
        `
          INSERT INTO POSTS
          (CONTENT, PHOTO_LINK, USER_ID)
          VALUES
          ("${content}", "${photo.location}", "${req.user.id}");
        `
      )

      return res.redirect(`/contents/${post._id}`)

    } catch (err) {
      next(err);
    }
  }
}

module.exports = postController;