import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, List, ListItem, ListItemText, Paper
} from '@mui/material';
import { useUsuario } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Casos = () => {
  const { usuario } = useUsuario();
  const [casos, setCasos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) return;

    const fetchCasos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/casos/doctor/${usuario.id}`);
        const data = await res.json();
        setCasos(data);
      } catch (error) {
        console.error('Error al obtener casos:', error);
      }
    };

    fetchCasos();
  }, [usuario]);

  const casosFiltrados = casos.filter((caso) =>
    caso.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    caso.nombre_paciente.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Casos clínicos</Typography>

      <TextField
        fullWidth
        label="Buscar por código o nombre del paciente"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        sx={{ mb: 3 }}
      />

      <List>
        {casosFiltrados.map((caso) => (
          <Paper key={caso.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/caso/${caso.id}`)}>
            <ListItem>
              <ListItemText
                primary={`Caso ${caso.codigo}`}
                secondary={
                  <>
                                      <Typography variant="body2">Paciente: {caso.nombre_paciente}</Typography>
                    <Typography variant="body2">Diseñador: {caso.nombre_disenador}</Typography>
                    <Typography variant="body2">Estado: {caso.estado} | Progreso: {caso.progreso || 0}%</Typography>
                    
                  </>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default Casos;
