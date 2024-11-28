import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';
import Signup from './components/Signup';
import Login from './components/Login';
import { AuthProvider } from './components/AuthContext';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;