import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    // Check if user is logged in and has ADMIN role (roles can be strings or objects)
    const isAdmin = user && user.roles?.some(role =>
        role === 'ROLE_ADMIN' || role.name === 'ROLE_ADMIN'
    );

    if (!user) {
        // Not logged in, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // Logged in but not admin, redirect to home
        return <Navigate to="/" replace />;
    }

    // User is admin, render the protected component
    return children;
};

export default AdminRoute;
