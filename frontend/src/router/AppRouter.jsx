import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import Reportes from '../components/Reportes';
import Sidebar from '../components/Sidebar';
import CambiarContrasena from '../components/CambiarContrasena';
import Resultados from '../components/Resultados';
import CambiarNombre from '../components/CambiarNombre';
import Room from '../components/Room';
import Tienda from '../components/Tienda';
import Inventario from '../components/Inventario';
import Casos from '../components/Casos';
import NuevoCaso from '../components/NuevoCaso';
import EditarCaso from '../components/EditarCaso';
// import Simulacro from '../components/Simulacro'; // desactivado por ahora
import VerCaso from '../components/VerCaso';


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Sidebar><Dashboard /></Sidebar>} />
      {/* <Route path="/simulacro" element={<Sidebar><Simulacro /></Sidebar>} /> */}
      <Route path="/reportes" element={<Sidebar><Reportes /></Sidebar>} />
      <Route path="/resultados" element={<Sidebar><Resultados /></Sidebar>} />
      <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
      <Route path="/cambiar-nombre" element={<Sidebar><CambiarNombre /></Sidebar>} />
      <Route path="/room" element={<Sidebar><Room /></Sidebar>} />
      <Route path="/tienda" element={<Sidebar><Tienda /></Sidebar>} />
      <Route path="/inventario" element={<Sidebar><Inventario /></Sidebar>} />
      <Route path="/casos" element={<Sidebar><Casos /></Sidebar>} />
      <Route path="/nuevo-caso" element={<Sidebar><NuevoCaso /></Sidebar>} />
      <Route path="/caso/:id" element={<Sidebar><VerCaso /></Sidebar>} />
      <Route path="/caso/:id/editar" element={<Sidebar><EditarCaso /></Sidebar>} />

    </Routes>
  );
};

export default AppRouter;
