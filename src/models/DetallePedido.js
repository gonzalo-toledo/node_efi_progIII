'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetallePedido extends Model {
    static associate(models) {
      // Cada detalle pertenece a un pedido y a un plato
      DetallePedido.belongsTo(models.Pedido, { foreignKey: 'pedidoId' });
      DetallePedido.belongsTo(models.Plato, { foreignKey: 'platoId' });
    }
  }
  DetallePedido.init({
    pedidoId: { type: DataTypes.INTEGER, allowNull: false },
    platoId:   { type: DataTypes.INTEGER, allowNull: false },
    cantidad:  { type: DataTypes.INTEGER, allowNull: false },
    precioUnitario: { type: DataTypes.DECIMAL(10,2), allowNull: false }
  }, {
    sequelize,
    modelName: 'DetallePedido',
    tableName: 'detalles_pedido',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  });
  return DetallePedido;
};
