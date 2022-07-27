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
import Report from "./component/Report";
import Menu from "./component/Menu";
import {AuthProvider} from './component/auth';
import {RequireAuth} from './component/RequireAuth';
import {CheckAuth} from './component/CheckAuth';
import Moderation from "./component/Moderation/Moderation";
import {CheckAdmin} from "./component/CheckAdmin";
import UserManagement from "./component/Moderation/UserManagement";
import ShowUser from "./component/Moderation/ShowUser";
import MessageManagement from "./component/Moderation/MessageManagement";
import CreateUser from "./component/Moderation/CreateUser";
import EditUser from "./component/Moderation/EditUser";

function App() {

    return (
        <AuthProvider>
            <Menu/>
            <Routes>
                <Route path="/" element={
                        <Login/>
                }/>
                <Route path="/register" element={
                        <Register/>
                }/>

                <Route path="/profile" element={
                        <Profile/>
                }/>

                <Route path="/users/users" element={
                    <Users/>
                }/>

                <Route path="/users/user/">
                    <Route path=":id" element={ <User />} />
                </Route>

                
                <Route path="/users/report/user/">
                    <Route path=":id" element={ <Report />} />
                </Route>

                <Route path="/users/send-invitation" element={
                    <InvitationSent/>
                }/>

                <Route path="/users/friend-request" element={
                    <FriendRequest/>
                }/>

                <Route path="/users/friends" element={
                    <Friends/>
                }/>

                <Route path="/messages" element={
                    <Message/>
                }/>

              
                <Route path="/admin" element={
                    <Moderation/>
                }/>

                <Route path="/admin/manage-user" element={
                    <UserManagement/>
                }/>

                <Route path="/admin/show-user/:id" element={
                    <ShowUser/>
                }/>

                <Route path="/admin/edit-user/:id" element={
                    <EditUser/>
                }/>

                <Route path="/admin/create-user" element={
                    <CreateUser/>
                }/>

                <Route path="/admin/manage-message" element={
                    <MessageManagement/>
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
