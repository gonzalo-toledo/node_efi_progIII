'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('platos', [
      { nombre: 'Milanesa', descripcion: 'Con papas', precio: 3500, disponibilidad: true, created_at: now, updated_at: now },
      { nombre: 'Pasta', descripcion: 'Bolognesa', precio: 4200, disponibilidad: true, created_at: now, updated_at: now },
      { nombre: 'Ensalada César', descripcion: 'Clásica', precio: 3000, disponibilidad: true, created_at: now, updated_at: now }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('platos', null, {});
  }
};
