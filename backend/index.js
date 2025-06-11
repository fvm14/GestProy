const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas backend
const userRoutes = require('./routes/UserRoutes');
const simulacroRoutes = require('./routes/SimulacroRoutes');
const reporteRoutes = require('./routes/ReporteRoutes');
const roomRoutes = require('./routes/RoomRoutes');
const tiendaRoutes = require('./routes/TiendaRoutes');
const casosRouter = require('./controllers/CasoClinicoController');

// Usar rutas
app.use('/api/usuarios', userRoutes);
app.use('/api/simulacro', simulacroRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/tienda', tiendaRoutes);
app.use('/api/casos', casosRouter);

// Servir archivos frontend
const publicPath = path.join(__dirname, 'front');
app.use(express.static(publicPath));

// Redirigir raíz al index del frontend
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en: http://localhost:${PORT}`);
});
