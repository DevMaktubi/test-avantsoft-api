const { STRING } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
  username: { type: STRING, unique: true },
  passwordHash: { type: STRING }
});

module.exports = User;