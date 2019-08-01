const Post = require('../model/post');
const Comment = require('../model/comment');

const commentsController = {
  addComment : async (req, res, next) => {
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
    post.save();

    return res.json(newComment);
  },
}

module.exports = commentsController;