// src/database/setup.js
const db = require('./db');

db.serialize(() => {
  // Tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      contrasena TEXT NOT NULL,
      experiencia INTEGER DEFAULT 0,
      monedas INTEGER DEFAULT 0,
      configuracion TEXT,
      rol TEXT NOT NULL
    )
  `);

  // Tabla de casos clínicos
  db.run(`
    CREATE TABLE IF NOT EXISTS casos_clinicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT NOT NULL UNIQUE,
      doctor_id INTEGER NOT NULL,
      paciente_id INTEGER NOT NULL,
      disenador_id INTEGER NOT NULL,
      notas TEXT,
      estado TEXT DEFAULT 'registrado',
      progreso INTEGER DEFAULT 0,
      ver_prototipo INTEGER DEFAULT 0,
      fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
      archivo_diseno TEXT, -- nueva columna para guardar el nombre del archivo
      FOREIGN KEY (doctor_id) REFERENCES usuarios(id),
      FOREIGN KEY (paciente_id) REFERENCES usuarios(id),
      FOREIGN KEY (disenador_id) REFERENCES usuarios(id)
    )
  `);
  

  console.log("✅ Tablas de usuarios y casos clínicos creadas correctamente.");
});

module.exports = db;
