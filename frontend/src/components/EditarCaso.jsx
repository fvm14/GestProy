import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, MenuItem
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EditarCaso = () => {
  const { id } = useParams();
  const [caso, setCaso] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaso = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/casos/${id}`);
        const data = await res.json();
        setCaso(data);
      } catch (err) {
        setMensaje('Error al cargar caso');
      }
    };
    fetchCaso();
  }, [id]);

  const handleChange = (e) => {
    setCaso({ ...caso, [e.target.name]: e.target.value });
  };

  const handleArchivo = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleGuardar = async () => {
    setMensaje('');
    try {
      const formData = new FormData();
      formData.append('notas', caso.notas || '');
      formData.append('progreso', caso.progreso);
      formData.append('ver_prototipo', caso.ver_prototipo === 'si' ? 1 : 0);
      formData.append('estado', caso.estado);
      if (archivo) {
        formData.append('archivo', archivo);
      }

      const res = await fetch(`http://localhost:3000/api/casos/${id}`, {
        method: 'PUT',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/casos');
      } else {
        setMensaje(data.mensaje || 'Error al actualizar');
      }
    } catch (err) {
      setMensaje('Error de red');
    }
  };

  if (!caso) return <Typography sx={{ p: 4 }}>Cargando caso...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Editar Caso Clínico
        </Typography>

        <TextField
          multiline
          fullWidth
          label="Notas clínicas"
          name="notas"
          value={caso.notas || ''}
          onChange={handleChange}
          rows={4}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Progreso (%)"
          name="progreso"
          type="number"
          inputProps={{ min: 0, max: 100 }}
          value={caso.progreso || ''}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          fullWidth
          label="Ver prototipo"
          name="ver_prototipo"
          value={caso.ver_prototipo ? 'si' : 'no'}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value="si">Sí</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Estado del caso"
          name="estado"
          value={caso.estado || ''}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value="registrado">Registrado</MenuItem>
          <MenuItem value="en revisión">En revisión</MenuItem>
          <MenuItem value="validado">Validado</MenuItem>
          <MenuItem value="finalizado">Finalizado</MenuItem>
        </TextField>

        {/* Subida de archivo */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          Archivo de Diseño de Prótesis:
        </Typography>

        {caso.archivo_diseno && (
          <Typography sx={{ mb: 1 }}>
            Archivo actual:{' '}
            <a href={`http://localhost:3000/uploads/${caso.archivo_diseno}`} target="_blank" rel="noopener noreferrer">
              {caso.archivo_diseno}
            </a>
          </Typography>
        )}

        <input type="file" onChange={handleArchivo} style={{ marginBottom: 16 }} />

        {mensaje && (
          <Typography color="error" sx={{ mb: 2 }}>{mensaje}</Typography>
        )}

        <Button variant="contained" color="primary" onClick={handleGuardar}>
          Guardar cambios
        </Button>
      </Paper>
    </Box>
  );
};

export default EditarCaso;
