const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  username : String,
  email : String,
  password : String
});

userSchema.pre('save', async function(next) {
  console.log(this.isModified("password"))
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