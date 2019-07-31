const mongoose = require('mongoose');
const UserSchema = require('./user').schema;
const CommentSchema = require('./comment').schema;
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
  content : String,
  photo : [String],
  createdDate : {
    type : Date,
    default : Date.now()
  },
  meta : {
    views : {
      type : Number,
      default : 0
    },
    likes : {
      type : Number,
      default : 0
    },
    comments : {
      type : Number,
      default : 0
    }
  },
  author : UserSchema,
  likeUsers : {
    type : Map,
    of : { type : Schema.Types.ObjectId, ref : 'User' },
  },
  comment : [CommentSchema],
  display : {
    type : Boolean,
    default : true
  },
});

module.exports = mongoose.model('Post', postSchema);