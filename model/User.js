const bcrypt = require('bcrypt');

const User = class {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
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