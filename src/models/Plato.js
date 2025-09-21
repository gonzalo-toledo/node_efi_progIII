'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Plato extends Model {
    static associate(models) {
      // Un plato participa en muchos detalles de pedido
      Plato.hasMany(models.DetallePedido, { foreignKey: 'platoId' });
    }
  }
  Plato.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    disponibilidad: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Plato',
    tableName: 'platos',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  });
  return Plato;
};
