// components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, tokens } = useContext(AuthContext);

    if (!user || !tokens.accessToken) {
        // Redirect to login if there's no user or access token
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;