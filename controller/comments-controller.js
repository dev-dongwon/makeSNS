const Post = require("../model/post");
const User = require("../model/user");
const pool = require("../db/connect-mysql").pool;
const Comment = require("../model/comment");

const commentsController = {
  addComment: async (req, res, next) => {

    try {
      const { comment, contentId } = req.body;
      const connection = await pool.getConnection(async conn => conn);

      // comment 등록, post 조회수 업데이트 트랜잭션
      await connection.beginTransaction();
      const [commentRow] = await connection.query(
        "INSERT INTO COMMENTS(COMMENT, POST_ID, USER_ID) VALUES(? ,?, ?)",
        [comment, contentId, req.user.id]
      );

      const [postRow] = await connection.query(
        `
        UPDATE POSTS
        SET COMMENT_COUNT = COMMENT_COUNT + 1
        WHERE ID = "${contentId}";
        `
      );
      await connection.commit();
      connection.release();

      // ajax 추가를 위한 update 데이터
      const updatedComment = {
        "userAvatar" : req.user.photolink,
        "username" : req.user.username,
        "content" : comment,
        "id" : commentRow.insertId,
        "createdDate" : Date.now(),
      }

      return res.json(updatedComment);
    
    } catch (error) {
      next(error);
    }
  },

  removeComment: async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const comment = await Comment.findById(commentId);
      comment.display = false;
      comment.save();

      const post = await Post.findById(comment.postId);
      post.comments.filter(
        val => `${val._id}` === commentId
      )[0].display = false;
      post.meta.comments -= 1;
      post.save();

      res.json("success");
    } catch (error) {
      next(error);
    }
  },

  updateComment: async (req, res, next) => {
    const { id, updatedReply, contentId } = req.body;
    const post = await Post.findById(contentId);
    post.comments.filter(
      comment => `${comment._id}` === id
    )[0].content = updatedReply;
    await post.save();
    return res.end("success");
  }
};

module.exports = commentsController;
