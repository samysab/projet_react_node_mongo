import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';

export const CheckAdmin = ({ children }) => {
    const location = useLocation();
    const auth = useAuth();
    if (!auth.user.isAdmin || !auth.user.success) {
        return <Navigate to='/' state={{ path: location.pathname }} />
    }
    return children;
}