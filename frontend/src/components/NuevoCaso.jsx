import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Paper
} from '@mui/material';
import { useUsuario } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const NuevoCaso = () => {
  const { usuario } = useUsuario();
  const [pacientes, setPacientes] = useState([]);
  const [disenadores, setDisenadores] = useState([]);
  const [form, setForm] = useState({
    paciente_id: '',
    disenador_id: '',
    notas_clinicas: ''
  });
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const cleanRol = (rol) =>
    rol?.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/usuarios');
        const data = await res.json();
        setPacientes(data.filter(u => cleanRol(u.rol) === 'paciente'));
        setDisenadores(data.filter(u => cleanRol(u.rol) === 'disenador'));
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
      }
    };
    fetchUsuarios();
  }, []);

  const generarCodigo = () => {
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `C${random}`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleCrear = async () => {
    setMensaje('');
    if (!form.paciente_id || !form.disenador_id) {
      return setMensaje('Todos los campos son obligatorios');
    }

    const codigo = generarCodigo();
    const formData = new FormData();
    formData.append('codigo', codigo);
    formData.append('paciente_id', form.paciente_id);
    formData.append('disenador_id', form.disenador_id);
    formData.append('doctor_id', usuario.id);
    formData.append('notas_clinicas', form.notas_clinicas);
    if (archivo) {
      formData.append('archivo_diseno', archivo);
    }

    try {
      const res = await fetch('http://localhost:3000/api/casos', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/casos');
      } else {
        setMensaje(data.mensaje || 'Error al crear caso');
      }
    } catch (err) {
      setMensaje('Error de red');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Crear nuevo caso clínico
        </Typography>

        <TextField
          select
          fullWidth
          label="Seleccionar paciente"
          name="paciente_id"
          value={form.paciente_id}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>Seleccionar paciente</MenuItem>
          {pacientes.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Seleccionar diseñador"
          name="disenador_id"
          value={form.disenador_id}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>Seleccionar diseñador</MenuItem>
          {disenadores.map(d => (
            <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>
          ))}
        </TextField>

        <TextField
          multiline
          fullWidth
          name="notas_clinicas"
          label="Notas clínicas"
          value={form.notas_clinicas}
          onChange={handleChange}
          rows={4}
          sx={{ mb: 2 }}
        />

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mb: 2 }}
        >
          Subir diseño de prótesis
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {archivo && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Archivo seleccionado: {archivo.name}
          </Typography>
        )}

        {mensaje && (
          <Typography color="error" sx={{ mb: 2 }}>{mensaje}</Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleCrear}
        >
          Crear caso
        </Button>
      </Paper>
    </Box>
  );
};

export default NuevoCaso;
