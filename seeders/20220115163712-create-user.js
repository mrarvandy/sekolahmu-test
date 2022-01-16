'use strict';

const {generatePassword} = require('../helpers/bcrypt')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin001',
        password: generatePassword('manchester01'),
        role: 'Admin',
        name: 'Admin 01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        username: 'teacher001',
        password: generatePassword('london01'),
        role: 'Teacher',
        name: 'Teacher 01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        username: 'student001',
        password: generatePassword('liverpool01'),
        role: 'Student',
        name: 'Student 01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
