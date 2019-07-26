const mongoose = require('mongoose');
const postSchema = require('./post').schema;
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  username : String,
  email : String,
  password : String,
  profilePhoto : {
    type : String,
    default : `/images/profile_dummy.png`
  },
  posts : [{ type : Schema.Types.ObjectId, ref : 'Post' }],
  createdDate : {
    type : Date,
    default : Date.now()
  },
  followings : [{ type : Schema.Types.ObjectId, ref : 'User' }],
  followers : [{ type : Schema.Types.ObjectId, ref : 'User' }]
});

userSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
})

userSchema.pre('findOneAndUpdate', async function(next) {
  if (this._update.password.length > 12) {
    return next();
  }
  
  const hash = await bcrypt.hash(this._update.password, 10);
  this._update.password = hash;
  next();
})


userSchema.methods.isValidPassword = async function(password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
}

module.exports = mongoose.model('User', userSchema);