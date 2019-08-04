const Post = require('../model/post');
const User= require('../model/user');
const Comment = require('../model/comment');

const commentsController = {
  addComment : async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
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

  removeComment : async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const comment = await Comment.findById(commentId);
      comment.display = false;
      comment.save();
  
      const post = await Post.findById(comment.postId);
      post.comment.filter(val => `${val._id}` === commentId )[0].display = false;
      post.meta.comments -= 1;
      post.save();
  
      res.json('success');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = commentsController;