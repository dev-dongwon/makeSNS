const Post = require('../model/post');

const contentController = {
  getContentPage: async (req, res, next) => {
    try {
      const content = await Post.findById(req.params.contentNumber);
      content.meta.views += 1;
      await content.save();
      
      const likes = JSON.stringify(req.user.likePosts);
      
      res.render('content', {
        title: 'Daily Frame | The creators Network',
        user: req.user,
        content,
        time : req.query.time,
        likes : likes || null
      });
      
    } catch (error) {
      next(error);
    }
  },

  deleteContent : async (req, res, next) => {

    try {
      const content = req.content;
      content.display = false;
      await content.save();
      
      return res.end('success');
    } catch (error) {
      next(error);
    }
  },

  updateContent : async (req, res, next) => {

    try {
      const content = req.content;
  
      if (req.files) {
        const arr = [];
        req.files.forEach((img) => {
          arr.push(img.location);
        });
        content.photo = arr;
      }
  
      if (req.body.content) {
        content.content = req.body.content;
      }
  
      content.save();
      return res.end('success');
    } catch (error) {
      next(error);
    }
  },

  updateLike : (req, res, next) => {

    const content = req.content;
    const user = req.user;

    if (content.likeUsers && content.likeUsers.get(`${user._id}`)) {
      return res.end('alreadyLike')
    }

    user.set(`likePosts.${content._id}`, content._id)
    user.save();

    content.meta.likes += 1;
    content.set(`likeUsers.${req.user._id}`, req.user._id);
    content.save();

    return res.end('success')
  }

}

module.exports = contentController;