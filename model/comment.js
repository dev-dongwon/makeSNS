const mongoose = require('mongoose');
const UserSchema = require('./user');

const commentSchema = mongoose.Schema({
  content : String,
  createdDate : {
    type : Date,
    default : Date.now()
  },
  meta : {
    likes : Number,
  },
  author : { type : Schema.Types.ObjectId, ref : 'User' },
  username : String,
  userAvatar : String,
  likeUser : [{ type : Schema.Types.ObjectId, ref : 'User' }],
  hidden : Boolean
});

module.exports = mongoose.model('Comment', commentSchema);