import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { LoadingProvider } from './context/LoadingContext';
import { ProtectedRoute } from './context/ProtectedRoute';

//Pages
import Home from './pages/Home.tsx';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateReclamos from './pages/CreateReclamos';

function App() {
  const rol = localStorage.getItem("roles"); 
  
  
  return (
    <LoadingProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas para USUARIOS */}
          <Route element={<ProtectedRoute allowedRoles={['user']} userRole={rol} />}>
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/create-reclamo" element={<CreateReclamos />} />
          </Route>

          {/* Rutas para ADMINS */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} userRole={rol} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Opcional: Ruta 404 o No Autorizado */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}
export default App
