import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Link,
  InputAdornment, IconButton, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!nombre || !correo || !contrasena || !rol) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena, rol })
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/');
      } else {
        setMensaje(data.mensaje || 'Error al registrar');
      }
    } catch (err) {
      setMensaje('Error de red al conectar con el servidor');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#E3F2FD' }}>
      {/* Lado izquierdo: imagen y bienvenida */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#BBDEFB',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 4,
        }}
      >
        <img src="/img/clinica_logo.png" alt="Logo Clínica" style={{ width: 180, marginBottom: 16 }} />
        <Typography variant="h4" sx={{ color: '#0D47A1', fontWeight: 'bold', mb: 1 }}>
          Bienvenido al sistema clínico
        </Typography>
        <Typography variant="h6" sx={{ color: '#1565C0' }}>
          Registra tu cuenta para comenzar
        </Typography>
      </Box>

      {/* Formulario de registro */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper
          elevation={4}
          sx={{
            p: 5,
            width: 400,
            borderRadius: 4,
            bgcolor: '#FFFFFF',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" align="center" sx={{ color: '#0D47A1', mb: 3 }}>
            Crear cuenta
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Nombre completo"
              margin="normal"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <TextField
              fullWidth
              label="Correo electrónico"
              margin="normal"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <TextField
              fullWidth
              label="Contraseña"
              margin="normal"
              type={mostrar ? 'text' : 'password'}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setMostrar((prev) => !prev)} edge="end">
                      {mostrar ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              select
              fullWidth
              label="Rol"
              margin="normal"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <MenuItem value="paciente">Paciente</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="disenador">Diseñador</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </TextField>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                mt: 3,
                bgcolor: '#1976D2',
                '&:hover': { bgcolor: '#1565C0' },
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Registrarse
            </Button>
          </form>

          {mensaje && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {mensaje}
            </Typography>
          )}

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            ¿Ya tienes cuenta? <Link href="/">Inicia sesión</Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;
