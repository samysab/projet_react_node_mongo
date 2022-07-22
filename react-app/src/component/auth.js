import {useState, createContext, useContext, useEffect} from 'react';
import Cookies from 'universal-cookie';

const AuthContext = createContext(null);
const request = new XMLHttpRequest();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const cookies = new Cookies();

    useEffect(() => {

            const check = async () => {
                request.open("GET", 'http://localhost:5000/users/checkUser', false);
                request.setRequestHeader("Content-type", "application/json");
                request.setRequestHeader("Authorization", "Bearer " + cookies.get('token'));
                request.send();

                if (request.response !== 'Unauthorized') {
                    login(JSON.parse(request.response));
                }
            }

            check()
        }, []
    );

    const login = user => {
        setUser(user);
    }

    const logout = () => {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}