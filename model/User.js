const bcrypt = require('bcrypt');

const User = class {
  constructor(id = null, username = null, email = null, password = null) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  async getCryptoPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async isValidPassword(password) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
  }
}

module.exports = User;