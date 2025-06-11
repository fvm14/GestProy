import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Avatar, Grid
} from '@mui/material';
import { useUsuario } from '../context/UserContext';

const Dashboard = () => {
  const { usuario, setUsuario } = useUsuario();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario?.id) return;

    const obtenerDatos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/usuarios/perfil-id?id=${usuario.id}`);
        const data = await res.json();
        if (data.perfil) {
          // ⚠️ Solo actualiza campos sin reemplazar usuario completo
          setUsuario(prev => ({ ...prev, ...data.perfil }));
        }
      } catch (err) {
        console.error('❌ Error al obtener perfil:', err);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [usuario?.id]); // ✅ Solo se ejecuta una vez cuando el ID esté listo

  if (cargando || !usuario) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Cargando usuario...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#E3F2FD',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '64px',
        boxSizing: 'border-box'
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 4,
          maxWidth: 700,
          width: '100%',
          bgcolor: '#FFFFFF',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Imagen del doctor */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <img src="/img/doctor.png" alt="Doctor" style={{ width: '220px' }} />
          </Grid>

          {/* Nombre y correo */}
          <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#1976D2', margin: '0 auto' }}>
              {usuario.nombre[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
              {usuario.nombre}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {usuario.correo}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
