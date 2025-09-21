'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Admin',
        email: 'admin@demo.com',
        password: await bcrypt.hash('admin123', 10),
        rol: 'admin',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        nombre: 'Cocinero',
        email: 'chef@demo.com',
        password: await bcrypt.hash('chef123', 10),
        rol: 'cocinero',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        nombre: 'Mesero',
        email: 'mesero@demo.com',
        password: await bcrypt.hash('mesero123', 10),
        rol: 'mesero',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
