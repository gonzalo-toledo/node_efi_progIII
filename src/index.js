require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes    = require('./routes/auth.routes');
const platosRoutes  = require('./routes/platos.routes');
const mesasRoutes   = require('./routes/mesas.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const detallesRoutes= require('./routes/detalle_pedido.routes');
const usuariosRoutes= require('./routes/usuarios.routes');

const app = express();
app.use(express.json());

app.use(cors());

app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/platos', platosRoutes);
app.use('/mesas', mesasRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/detalles_pedido', detallesRoutes);

const PORT = process.env.PORT || 3000;
sequelize.authenticate()
  .then(() => {
    console.log('DB OK');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => { console.error('DB error:', err); process.exit(1); });
