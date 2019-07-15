const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    String : String,
    required : true
  }
});

userSchema.pre('save', async function(next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
})

userSchema.methods.validPassword = function(password) {
  return password === this.password;
}

module.exports = mongoose.model('User', userSchema);