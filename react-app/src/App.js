import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import Message from "./component/Messages";
import Profile from "./component/Profile";
import Users from "./component/Users";
import FriendRequest from "./component/FriendRequest";
import Friends from './component/Friends';
import User from './component/User';
import InvitationSent from './component/InvitationSent';
import Confirmation from "./component/Confirmation";
import Reset from "./component/Reset";
import Error404 from "./component/404";
import Menu from "./component/Menu";
import { AuthProvider } from './component/auth';
import { RequireAuth } from './component/RequireAuth';
import { CheckAuth } from './component/CheckAuth';

function App() {
  return (
      <AuthProvider>
          <Menu />
          <Routes>

            <Route path="/" element={
                <CheckAuth>
                    <Login />
                </CheckAuth>
            }/>

            <Route path="/register" element={
                <CheckAuth>
                    <Register />
                </CheckAuth>
            }/>

            <Route path="/profile" element={
                <RequireAuth>
                    <Profile />
                </RequireAuth>
            }/>
            
            <Route path="/users/users" element={
               
                    <Users />
                
            }/>

            <Route path="/users/user/:id" element={
               
                    <User />
                
            }/>

            <Route path="/users/send-invitation" element={
                
                    <InvitationSent />
              
            }/>

            <Route path="/users/friend-request" element={
                
                    <FriendRequest />
              
            }/>

            <Route path="/users/friends" element={
               
                    <Friends />
               
            }/>


            <Route path="/confirmation">
                <Route path=":id" element={<Confirmation />} />
            </Route>

            <Route path="/resetPassword">
                <Route path=":id" element={<Reset />} />
            </Route>
            
            <Route path="*" element={<Error404 />} />
          </Routes>
      </AuthProvider>
);
}

export default App;
