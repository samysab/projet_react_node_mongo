import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from './auth';

export const CheckAdmin = ({children}) => {
    const location = useLocation();
    const auth = useAuth();
    console.log(auth);
    if (auth.user) {
        if (!auth.user.isAdmin)
            return <Navigate to='/' state={{path: location.pathname}}/>

    }
    return children;
}