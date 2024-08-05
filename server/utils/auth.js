const jwt = require('jsonwebtoken');
const { User } = require('../models');

const secret = 'your_secret_key';
const expiration = '2h';

module.exports = {
  signToken: ({ username, email, _id }) => {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  getUser: (token) => {
    if (token) {
      try {
        const { data } = jwt.verify(token, secret, { complete: true }).payload;
        return User.findById(data._id).select('-__v -password');
      } catch {
        return null;
      }
    }
  },
};