'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    static associate(models) {
      // Pedido pertenece a una mesa
      Pedido.belongsTo(models.Mesa, { foreignKey: 'mesaId' });
      // Pedido pertenece a un mesero (usuario con rol mesero)
      Pedido.belongsTo(models.Usuario, { as: 'mesero', foreignKey: 'meseroId' });
      // Pedido tiene muchos detalles
      Pedido.hasMany(models.DetallePedido, { foreignKey: 'pedidoId', as: 'detalles', onDelete: 'CASCADE' });
    }
  }
  Pedido.init({
    mesaId: { type: DataTypes.INTEGER, allowNull: false },
    meseroId: { type: DataTypes.INTEGER, allowNull: false },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en preparación', 'listo', 'servido','cuenta solicitada', 'pagado', 'cancelado', 'cerrado'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 }
  }, {
    sequelize,
    modelName: 'Pedido',
    tableName: 'pedidos',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  });
  return Pedido;
};
