const Post = require('../model/post');
const Comment = require('../model/comment');

const commentsController = {
  addComment : async (req, res, next) => {
    try {
      const user = req.user;
      const {comment, contentId} = req.body
      
      const newComment = await Comment.create({
        content : comment,
        authorId : user._id,
        postId : contentId,
        username : user.username,
        userAvatar : user.profilePhoto,
      })
  
      const post = await Post.findById(contentId);
      post.comment.push(newComment);
      post.meta.comments += 1;
      post.save();
      return res.json(newComment);
    } catch (error) {
      next(error);
    }
  },
}

module.exports = commentsController;