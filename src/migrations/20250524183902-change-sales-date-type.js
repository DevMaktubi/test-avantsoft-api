'use strict';

const { NOW } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('Sales', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: NOW
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('Sales', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    });
  }
};
