'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Un mesero (usuario) puede tener muchos pedidos
      Usuario.hasMany(models.Pedido, { foreignKey: 'meseroId' });
    }
  }
  Usuario.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    email:    { type: DataTypes.STRING,  allowNull: false, unique: true, field: 'email' },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: {
      type: DataTypes.ENUM('admin', 'cocinero', 'mesero'),
      allowNull: false,
      defaultValue: 'mesero'
    },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  });
  return Usuario;
};
