const Post = require('../model/post');
const User = require('../model/user');
const pool = require('../db/connect-mysql').pool;

const contentController = {
  getContentPage: async (req, res, next) => {
    try {
      // 게시물과 게시물 작성자 정보 가져오기
      const [postRowData] =  await pool.query(
        `
        SELECT
          author.id author_id, author.username author_username, author.photo_link author_photolink,
          post.id post_id, post.content post_content, post.photo_link post_photolink, post.created_date post_created_Date, post.view_count post_view_count, post.like_count post_like_count, post.comment_count post_comment_count
        FROM
          USERS as author
        JOIN
          ( select * from POSTS where id = "${req.params.contentNumber}" ) as post
        ON
          post.USER_ID = author.ID;
    `);

      const post = postRowData[0];

      // comment 정보 가져오기
      const [commentRowData] = await pool.query(
        `
        SELECT
          comment.id comment_id,
          comment.comment comment_comment,
          comment.created_date comment_created_date,
          comment.validation comment_validation,
          user.id user_id, user.username user_username, user.photo_link user_photolink
        FROM
          COMMENTS as comment
        JOIN
          USERS as user
        ON
          comment.validation = 'Y'
          and
          comment.USER_ID = user.ID;
        `
      )

      post.comments = commentRowData;

      // 게시물과 login user 와의 관계 (좋아요를 눌렀는지, 작성자와 팔로우가 됐는지)
      if (req.user) {
        const [relationRowData] = await pool.query(
          `
          SELECT follower_id, following_id FROM FOLLOW WHERE follower_id = "${req.user.id}" and following_id = "${post.author_id}"
          UNION
          SELECT user_id, post_id FROM LIKES WHERE user_id = "${req.user.id}" and post_id = "${post.post_id}";
          `
        )
        req.user.relation = relationRowData[0];
      }

      // 게시물 조회 수 update
      await pool.query(
        `
        UPDATE POSTS
        SET VIEW_COUNT = VIEW_COUNT + 1
        WHERE ID = "${req.params.contentNumber}";
        `
      )
      
      res.render('content', {
        title: 'Daily Frame | The creators Network',
        user: req.user,
        post,
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
      const user = await User.findById(req.user._id);
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