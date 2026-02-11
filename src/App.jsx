import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext';

//Pages
import Home from './pages/Home.tsx';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateReclamos from './pages/CreateReclamos';

function App() {
  return (
<<<<<<< HEAD
    <BrowserRouter>
      {/* Public routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* Private routes */}
      <Routes element={<ProtectedRoute canAccess={user.role === 'user'} />}>
        <Route path="/user/user-dashboard" element={<UserDashboard />} />
        <Route path="/user/create-reclamo" element={<CreateReclamos />} />
      </Routes>

      <Routes element={<ProtectedRoute canAccess={user.role === 'admin'} />}>
        <Route path="/admin/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      
    </BrowserRouter>
=======
    <LoadingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/create-reclamo" element={<CreateReclamos />} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
>>>>>>> bd982a9 (actualizacion de config y lista la parte de login y register - manejo de sesiones)
  );
}

export default App
