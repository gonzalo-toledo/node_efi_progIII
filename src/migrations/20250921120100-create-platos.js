'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('platos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      precio: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      disponibilidad: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
    await queryInterface.addIndex('platos', ['nombre'], { name: 'platos_nombre_index' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('platos', 'platos_nombre_index');
    await queryInterface.dropTable('platos');
  }
};
