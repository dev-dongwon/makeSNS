const Post = require('../model/post');

const contentController = {
  getContentPage: async (req, res, next) => {
    try {
      const content = await Post.findById(req.params.contentNumber);
      content.meta.views += 1;
      await content.save();
  
      res.render('content', {
        title: 'Daily Frame | The creators Network',
        user: req.user,
        content
      });
      
    } catch (error) {
      next(error);
    }
  },

  deleteContent : async (req, res, next) => {

    try {
      const content = await Post.findById(req.params.contentNumber);
      content.display = false;
      await content.save();
  
      return res.end('success');
    } catch (error) {
      next(error);
    }
  },

}

module.exports = contentController;