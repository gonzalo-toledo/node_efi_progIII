'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Mesa extends Model {
    static associate(models) {
      // Una mesa puede tener muchos pedidos
      Mesa.hasMany(models.Pedido, { foreignKey: 'mesaId' });
    }
  }
  Mesa.init({
    numero: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    capacidad: { type: DataTypes.INTEGER, allowNull: false },
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Mesa',
    tableName: 'mesas',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  });
  return Mesa;
};
