'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('detalles_pedido', [
      // Pedido 1 (pendiente)
      {
        pedidoId: 1,
        platoId: 1, // Milanesa
        cantidad: 2,
        precioUnitario: 3500,
        created_at: now,
        updated_at: now
      },
      {
        pedidoId: 1,
        platoId: 3, // Ensalada César
        cantidad: 1,
        precioUnitario: 3000,
        created_at: now,
        updated_at: now
      },

      // Pedido 2 (en preparación)
      {
        pedidoId: 2,
        platoId: 2, // Pasta
        cantidad: 2,
        precioUnitario: 4200,
        created_at: now,
        updated_at: now
      },

      // Pedido 3 (listo)
      {
        pedidoId: 3,
        platoId: 1, // Milanesa
        cantidad: 1,
        precioUnitario: 3500,
        created_at: now,
        updated_at: now
      },
      {
        pedidoId: 3,
        platoId: 2, // Pasta
        cantidad: 1,
        precioUnitario: 4200,
        created_at: now,
        updated_at: now
      },

      // Pedido 4 (servido)
      {
        pedidoId: 4,
        platoId: 3, // Ensalada César
        cantidad: 2,
        precioUnitario: 3000,
        created_at: now,
        updated_at: now
      },

      // Pedido 5 (cancelado)
      {
        pedidoId: 5,
        platoId: 1, // Milanesa
        cantidad: 1,
        precioUnitario: 3500,
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('detalles_pedido', null, {});
  }
};
