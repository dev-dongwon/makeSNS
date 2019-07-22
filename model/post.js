const mongoose = require('mongoose');
const UserSchema = require('./user');
const CommentSchema = require('./comment');

const postSchema = mongoose.Schema({
  content : String,
  createdDate : {
    type : Date,
    default : Date.now()
  },
  meta : {
    views : Number,
    likes : Number,
  },
  author : UserSchema,
  likeUser : [{ type : Schema.Types.ObjectId, ref : 'User' }],
  comment : [CommentSchema],
  hidden : Boolean
});

module.exports = mongoose.model('Post', postSchema);