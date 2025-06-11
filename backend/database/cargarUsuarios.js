const db = require('./db');
const usuarios = require('../data/usuarios.json');

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO usuarios (nombre, correo, contrasena, rol)
    VALUES (?, ?, ?, ?)
  `);

  usuarios.forEach((u) => {
    stmt.run(u.nombre, u.correo, u.contrasena, u.rol);
  });

  stmt.finalize(() => {
    console.log('✅ Usuarios cargados correctamente.');
    db.close();
  });
});
