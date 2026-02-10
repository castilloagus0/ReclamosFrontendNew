import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import Home from './pages/Home.tsx';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateReclamos from './pages/CreateReclamos';

function App() {
  return (
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
  );
}

export default App
