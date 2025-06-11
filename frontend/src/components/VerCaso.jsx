import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Divider, CircularProgress, Button
} from '@mui/material';

const VerCaso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caso, setCaso] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerCaso = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/casos/${id}`);
        const data = await res.json();
        if (res.ok) setCaso(data);
      } catch (err) {
        console.error('Error al obtener caso:', err);
      } finally {
        setCargando(false);
      }
    };

    obtenerCaso();
  }, [id]);

  if (cargando) {
    return <Box p={4}><CircularProgress /></Box>;
  }

  if (!caso) {
    return <Box p={4}><Typography variant="h6">Caso no encontrado</Typography></Box>;
  }

  return (
    <Box p={4}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Detalles del caso {caso.codigo}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="body1"><strong>Paciente:</strong> {caso.nombre_paciente || 'No disponible'}</Typography>
        <Typography variant="body1"><strong>Diseñador:</strong> {caso.nombre_disenador || 'No disponible'}</Typography>
        <Typography variant="body1"><strong>Doctor:</strong> {caso.nombre_doctor || 'No disponible'}</Typography>

        <Typography variant="body1" sx={{ mt: 2 }}><strong>Notas clínicas:</strong></Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{caso.notas || 'Sin notas'}</Typography>

        <Typography variant="body1"><strong>Estado:</strong> {caso.estado}</Typography>
        <Typography variant="body1"><strong>Progreso:</strong> {caso.progreso || 0}%</Typography>
        <Typography variant="body1"><strong>Fecha de creación:</strong> {new Date(caso.fecha_creacion).toLocaleString()}</Typography>
        <Typography variant="body1"><strong>Ver prototipo:</strong> {caso.ver_prototipo ? 'Permitido' : 'No permitido'}</Typography>

        {caso.archivo_diseno && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Diseño de prótesis:</strong>{' '}
            <a
              href={`http://localhost:3000/uploads/${caso.archivo_diseno}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Descargar diseño
            </a>
          </Typography>
        )}

        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/caso/${caso.id}/editar`)}
          >
            Editar caso
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default VerCaso;
