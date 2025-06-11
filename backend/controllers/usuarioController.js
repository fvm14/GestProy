
const db = require('../database/db');

function registrarUsuario(req, res) {
  const { nombre, correo, contrasena, rol } = req.body;

  if (!nombre || !correo || !contrasena || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  db.run(
    "INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)",
    [nombre, correo, contrasena, rol],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(409).json({ mensaje: "El correo ya está registrado" });
        }
        return res.status(500).json({ mensaje: 'Error al registrar usuario', detalle: err.message });
      }
      res.status(201).json({ mensaje: 'Usuario registrado correctamente', id: this.lastID });
    }
  );
}


function login(req, res) {
  const { correo, contrasena } = req.body;
  db.get("SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?", [correo, contrasena], (err, row) => {
    if (err) return res.status(500).json({ mensaje: 'Error en la consulta' });
    if (row) {
      res.json({ mensaje: 'Inicio de sesión exitoso', datos: row });
    } else {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  });
}

function obtenerTodos(req, res) {
  db.all("SELECT id, nombre, correo, rol FROM usuarios", (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    res.json(rows);
  });
}

function cambiarContrasena(req, res) {
  const { correo, contrasena_actual, contrasena_nueva } = req.body;
  db.get("SELECT * FROM usuarios WHERE correo = ?", [correo], (err, usuario) => {
    if (err || !usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    if (usuario.contrasena !== contrasena_actual)
      return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });

    db.run("UPDATE usuarios SET contrasena = ? WHERE correo = ?", [contrasena_nueva, correo], err => {
      if (err) return res.status(500).json({ mensaje: 'Error al cambiar contraseña' });
      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    });
  });
}

function actualizarNombre(req, res) {
  const { correo, nuevoNombre } = req.body;
  db.run("UPDATE usuarios SET nombre = ? WHERE correo = ?", [nuevoNombre, correo], err => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar el nombre' });
    res.json({ mensaje: 'Nombre actualizado correctamente' });
  });
}

function obtenerPerfil(req, res) {
  const { correo } = req.query;
  db.get("SELECT nombre, correo, experiencia, monedas FROM usuarios WHERE correo = ?", [correo], (err, row) => {
    if (err || !row) return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    res.json({ perfil: row });
  });
}

function obtenerPerfilPorId(req, res) {
  const { id } = req.query;

  db.get("SELECT nombre, correo, experiencia, monedas FROM usuarios WHERE id = ?", [id], (err, row) => {
    if (err || !row) return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    res.json({ perfil: row });
  });
}


module.exports = {
  registrarUsuario,
  login,
  cambiarContrasena,
  actualizarNombre,
  obtenerPerfil,
  obtenerPerfilPorId,
  obtenerTodos
};
