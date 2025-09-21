'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detalles_pedido', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      pedidoId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'pedidos', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },

      platoId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'platos', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },

      cantidad: { type: Sequelize.INTEGER, allowNull: false },
      precioUnitario: { type: Sequelize.DECIMAL(10,2), allowNull: false },

      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addIndex('detalles_pedido', ['pedidoId'], { name: 'detalles_pedido_pedido_idx' });
    await queryInterface.addIndex('detalles_pedido', ['platoId'], { name: 'detalles_pedido_plato_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('detalles_pedido', 'detalles_pedido_pedido_idx');
    await queryInterface.removeIndex('detalles_pedido', 'detalles_pedido_plato_idx');
    await queryInterface.dropTable('detalles_pedido');
  }
};
