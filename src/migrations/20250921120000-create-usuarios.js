'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      rol: {
        type: Sequelize.ENUM('admin', 'cocinero', 'mesero'),
        allowNull: false,
        defaultValue: 'mesero'
      },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
    await queryInterface.addIndex('usuarios', ['email'], { unique: true, name: 'usuarios_email_uindex' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('usuarios', 'usuarios_email_uindex');
    await queryInterface.dropTable('usuarios');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_usuarios_rol";'); // Postgres safety; en MySQL no afecta
  }
};
