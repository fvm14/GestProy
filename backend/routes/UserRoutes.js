const express = require('express');
const {
  registrarUsuario,
  login,
  cambiarContrasena,
  actualizarNombre,
  obtenerPerfil,
  obtenerPerfilPorId,
  obtenerTodos // 👈 AÑADIDO
} = require('../controllers/usuarioController');

const router = express.Router();

// Rutas válidas
router.post('/registro', registrarUsuario);
router.post('/login', login);
router.post('/cambiar-contrasena', cambiarContrasena);
router.post('/cambiar-nombre', actualizarNombre);
router.get('/perfil', obtenerPerfil);
router.get('/perfil-id', obtenerPerfilPorId);

// ✅ Ruta que permite al frontend cargar todos los usuarios
router.get('/', obtenerTodos); // 👈 AÑADIDO

module.exports = router;
