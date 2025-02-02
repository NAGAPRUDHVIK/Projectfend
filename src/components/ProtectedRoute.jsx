import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    if (!token) {
        return <Navigate to="/" />;
    }

    const hasAllowedRole = roles.some(role => allowedRoles.includes(role));
    if (!hasAllowedRole) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;

//http://localhost:8060/api/users/validate/user