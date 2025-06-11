import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Checkbox, FormControlLabel, Link,
  InputAdornment, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useUsuario } from '../context/UserContext';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const navigate = useNavigate();

  const { setUsuario } = useUsuario();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!aceptaTerminos) {
      setMensaje('Debes aceptar los términos y condiciones.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await res.json();
      if (res.ok) {
        setUsuario(data.datos);
        navigate('/dashboard');
      } else {
        setMensaje(data.mensaje || 'Error al iniciar sesión');
      }
    } catch (error) {
      setMensaje('Error de red al conectar con el servidor');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#E3F2FD' }}>
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
          Sistema Clínico
        </Typography>
        <Typography variant="h6" sx={{ color: '#1565C0' }}>
          Acceso exclusivo para usuarios autorizados
        </Typography>
      </Box>

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
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Correo electrónico"
              margin="normal"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <TextField
              fullWidth
              label="Contraseña"
              margin="normal"
              type={mostrarContrasena ? 'text' : 'password'}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setMostrarContrasena((prev) => !prev)} edge="end">
                      {mostrarContrasena ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                  sx={{ color: '#1976D2' }}
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los <Link href="#" underline="hover">términos y condiciones</Link>
                </Typography>
              }
              sx={{ mt: 1 }}
            />

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
              Ingresar
            </Button>

            {mensaje && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {mensaje}
              </Typography>
            )}

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              ¿Olvidaste tu contraseña? <Link href="/cambiar-contrasena">Recupérala</Link>
            </Typography>

            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              ¿No tienes cuenta? <Link href="/register">Regístrate aquí</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
