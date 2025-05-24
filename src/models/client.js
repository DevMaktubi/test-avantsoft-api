const { STRING } = require('sequelize');
const db = require('../config/database');

const Client = db.define('Client', {
  name: STRING,
  email: { type: STRING, unique: true },
  phone: STRING
});

module.exports = Client;