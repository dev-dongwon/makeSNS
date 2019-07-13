const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id : String,
  email : String,
  password : String
});

userSchema.methods.validPassword = function(password) {
  return password === this.password;
}

module.exports = mongoose.model('User', userSchema);