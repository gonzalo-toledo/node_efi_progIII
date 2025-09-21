'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('mesas', [
      { numero: 1, capacidad: 2, disponible: true, created_at: now, updated_at: now },
      { numero: 2, capacidad: 4, disponible: true, created_at: now, updated_at: now },
      { numero: 3, capacidad: 6, disponible: true, created_at: now, updated_at: now }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mesas', null, {});
  }
};
