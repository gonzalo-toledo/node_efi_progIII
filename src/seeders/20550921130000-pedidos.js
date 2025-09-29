'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // ⚠️ Importante: asegurate de que ya existan mesas y usuarios
    // porque estos IDs deben referenciar registros válidos
    await queryInterface.bulkInsert('pedidos', [
      {
        mesaId: 1,
        meseroId: 3,
        estado: 'pendiente',
        total: 1500.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        mesaId: 2,
        meseroId: 3,
        estado: 'en preparación',
        total: 2300.50,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        mesaId: 3,
        meseroId: 3,
        estado: 'listo',
        total: 1800.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        mesaId: 1,
        meseroId: 3,
        estado: 'servido',
        total: 3200.75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        mesaId: 2,
        meseroId: 3,
        estado: 'cancelado',
        total: 0.00,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pedidos', null, {});
  }
};
