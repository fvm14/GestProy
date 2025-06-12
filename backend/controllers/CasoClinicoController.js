  const express = require('express');
  const router = express.Router();
  const db = require('../database/db');
  const multer = require('multer');
  const path = require('path');

  // Configurar almacenamiento de archivos
  const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, `diseno_${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  const upload = multer({ storage });

  // Crear un nuevo caso clínico
  router.post('/', upload.single('archivo'), (req, res) => {
    const { codigo, paciente_id, disenador_id, doctor_id, notas_clinicas } = req.body;
    const archivo = req.file ? req.file.filename : null;

    if (!codigo || !paciente_id || !disenador_id || !doctor_id) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const query = `
      INSERT INTO casos_clinicos (codigo, paciente_id, disenador_id, doctor_id, notas, archivo_diseno)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [codigo, paciente_id, disenador_id, doctor_id, notas_clinicas, archivo], function (err) {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al crear caso', error: err.message });
      }
      res.status(201).json({ mensaje: 'Caso creado', id: this.lastID });
    });
  });

  // Obtener todos los casos de un doctor
  router.get('/doctor/:id', (req, res) => {
    const doctorId = req.params.id;

    const query = `
      SELECT cc.*, p.nombre AS nombre_paciente, d.nombre AS nombre_disenador
      FROM casos_clinicos cc
      JOIN usuarios p ON cc.paciente_id = p.id
      JOIN usuarios d ON cc.disenador_id = d.id
      WHERE cc.doctor_id = ?
      ORDER BY fecha_creacion DESC
    `;
    db.all(query, [doctorId], (err, rows) => {
      if (err) return res.status(500).json({ mensaje: 'Error al obtener casos' });
      res.json(rows);
    });
  });

  // Obtener caso por ID
  router.get('/:id', (req, res) => {
    const id = req.params.id;
    const query = `
      SELECT cc.*, 
            p.nombre AS nombre_paciente,
            d.nombre AS nombre_disenador,
            doc.nombre AS nombre_doctor
      FROM casos_clinicos cc
      JOIN usuarios p ON cc.paciente_id = p.id
      JOIN usuarios d ON cc.disenador_id = d.id
      JOIN usuarios doc ON cc.doctor_id = doc.id
      WHERE cc.id = ?
    `;
    db.get(query, [id], (err, row) => {
      if (err) return res.status(500).json({ mensaje: 'Error al buscar caso' });
      if (!row) return res.status(404).json({ mensaje: 'Caso no encontrado' });
      res.json(row);
    });
  });

  // Actualizar un caso clínico
  router.put('/:id', upload.single('archivo'), (req, res) => {
    const id = req.params.id;
    let { notas, progreso, ver_prototipo, estado } = req.body;
    const archivo = req.file ? req.file.filename : null;

    // Validación de progreso
    progreso = parseInt(progreso);
    if (isNaN(progreso) || progreso < 0) progreso = 0;
    if (progreso > 100) progreso = 100;

    // Validación de ver_prototipo (evita negativos)
    ver_prototipo = parseInt(ver_prototipo);
    if (![0, 1].includes(ver_prototipo)) ver_prototipo = 0;

    const query = `
      UPDATE casos_clinicos SET
        notas = ?,
        progreso = ?,
        ver_prototipo = ?,
        estado = ?,
        archivo_diseno = COALESCE(?, archivo_diseno)
      WHERE id = ?
    `;
    db.run(query, [notas, progreso, ver_prototipo, estado, archivo, id], function (err) {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al actualizar caso', error: err.message });
      }
      res.json({ mensaje: 'Caso actualizado' });
    });
  });

  // Filtro por código o nombre de paciente
  router.get('/filtro', (req, res) => {
    const texto = `%${req.query.busqueda}%`;
    const query = `
      SELECT cc.*, p.nombre AS nombre_paciente
      FROM casos_clinicos cc
      JOIN usuarios p ON cc.paciente_id = p.id
      WHERE cc.codigo LIKE ? OR p.nombre LIKE ?
    `;
    db.all(query, [texto, texto], (err, rows) => {
      if (err) return res.status(500).json({ mensaje: 'Error al filtrar casos' });
      res.json(rows);
    });
  });

  module.exports = router;
