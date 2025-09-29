'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      mesaId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'mesas', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },

      meseroId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },

      estado: {
        type: Sequelize.ENUM('pendiente', 'en preparación', 'listo', 'servido', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendiente'
      },

      total: { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0 },

      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addIndex('pedidos', ['mesaId'], { name: 'pedidos_mesa_idx' });
    await queryInterface.addIndex('pedidos', ['meseroId'], { name: 'pedidos_mesero_idx' });
    await queryInterface.addIndex('pedidos', ['estado'], { name: 'pedidos_estado_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('pedidos', 'pedidos_mesa_idx');
    await queryInterface.removeIndex('pedidos', 'pedidos_mesero_idx');
    await queryInterface.removeIndex('pedidos', 'pedidos_estado_idx');
    await queryInterface.dropTable('pedidos');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_pedidos_estado";');
  }
};
