const db = require('../config/database');
const Client = require('./client');
const Sale = require('./sale');
const User = require('./user');

Client.hasMany(Sale, { foreignKey: 'clientId', as: 'sales' });
Sale.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

module.exports = {
  db,
  Client,
  Sale,
  User
};
