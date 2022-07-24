import './App.css';
import {
    Routes,
    Route,
} from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import Profile from "./component/Profile";
import Confirmation from "./component/Confirmation";
import Reset from "./component/Reset";
import Error404 from "./component/404";
import Menu from "./component/Menu";
import {AuthProvider} from './component/auth';
import {RequireAuth} from './component/RequireAuth';
import {CheckAuth} from './component/CheckAuth';
import Moderation from "./component/Moderation/Moderation";
import {CheckAdmin} from "./component/CheckAdmin";

function App() {
    return (
        <AuthProvider>
            <Menu/>
            <Routes>
                <Route path="/" element={
                    <CheckAuth>
                        <Login/>
                    </CheckAuth>
                }/>
                <Route path="/register" element={
                    <CheckAuth>
                        <Register/>
                    </CheckAuth>
                }/>
                <Route path="/profile" element={
                    <RequireAuth>
                        <Profile/>
                    </RequireAuth>
                }/>

                <Route path="/admin" element={
                    <Moderation/>
                }/>

                <Route path="/confirmation">
                    <Route path=":id" element={<Confirmation/>}/>
                </Route>
                <Route path="/resetPassword">
                    <Route path=":id" element={<Reset/>}/>
                </Route>

                <Route path="*" element={<Error404/>}/>

            </Routes>
        </AuthProvider>
    );
}

export default App;
