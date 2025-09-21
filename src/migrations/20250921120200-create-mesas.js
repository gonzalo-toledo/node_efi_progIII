'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mesas', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      numero: { type: Sequelize.INTEGER, allowNull: false, unique: true },
      capacidad: { type: Sequelize.INTEGER, allowNull: false },
      disponible: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
    await queryInterface.addIndex('mesas', ['numero'], { unique: true, name: 'mesas_numero_uindex' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('mesas', 'mesas_numero_uindex');
    await queryInterface.dropTable('mesas');
  }
};
