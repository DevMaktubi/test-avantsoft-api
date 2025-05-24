const { DECIMAL, DATE } = require('sequelize');
const db = require('../config/database');

const Sale = db.define('Sale', {
  amount: {
    type: DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DATE,
    allowNull: false,
    defaultValue: new Date()
  }
});

module.exports = Sale;