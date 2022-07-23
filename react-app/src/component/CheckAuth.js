import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';

export const CheckAuth = ({ children }) => {
    const location = useLocation();
    const auth = useAuth();
    if (!auth.user) {
        return <Navigate to='/profile' state={{ path: location.pathname }} />
    }
    return children;
}