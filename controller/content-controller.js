const Post = require('../model/post');

const contentController = {
  getContentPage: async (req, res, next) => {
    try {
      const content = await Post.getContentByContentNumber(req.params.contentNumber);
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
      await Post.deleteContentByContentNumber(req.content);
      return res.end('success');
    } catch (error) {
      next(error);
    }
  },

  updateContent : async (req, res, next) => {
    try {
      await Post.updateContent(req.content, req.files, req.body.content);
      return res.end('success');
    } catch (error) {
      next(error);
    }
  },

  updateLike : async (req, res, next) => {

    try {
      const user = req.user;
      const content = await Post.findById(req.params.contentNumber);
      
      if (content.likeUsers && content.likeUsers.get(`${user._id}`)) {
        await Post.updateToBeUnLikeStatus(content, user);
        return res.end('unlike');
      }
  
      await Post.updateToBeLikeStatus(content, user);
      return res.end('like')
    
    } catch (error) {
      next(error);
    }
  }
}

module.exports = contentController;