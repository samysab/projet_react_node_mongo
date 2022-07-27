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
import Moderation from "./component/Moderation/Moderation";
import {CheckAdmin} from "./component/CheckAdmin";
import UserManagement from "./component/Moderation/UserManagement";
import ReportManager from "./component/Moderation/ReportManager";
import ShowUser from "./component/Moderation/ShowUser";
import MessageManagement from "./component/Moderation/MessageManagement";
import CreateUser from "./component/Moderation/CreateUser";
import EditUser from "./component/Moderation/EditUser";

function App() {

    return (
        <AuthProvider>
            <Menu/>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                <Route path="/profile" element={
                    <RequireAuth>
                        <Profile/>
                    </RequireAuth>
                }/>

                <Route path="/users/users" element={
                    <RequireAuth>
                        <Users/>
                    </RequireAuth>
                }/>

                <Route path="/users/user/">
                    <RequireAuth>
                        <Route path=":id" element={ <User />} />
                    </RequireAuth>
                </Route>
                
                <Route path="/users/report/user/">
                    <RequireAuth>
                        <Route path=":id" element={ <Report />} />
                    </RequireAuth>
                </Route>

                <Route path="/users/send-invitation" element={
                    <RequireAuth>
                        <InvitationSent/>
                    </RequireAuth>
                }/>

                <Route path="/users/friend-request" element={
                    <RequireAuth>
                        <FriendRequest/>
                    </RequireAuth>
                }/>

                <Route path="/users/friends" element={
                    <RequireAuth>
                        <Friends/>
                    </RequireAuth>
                }/>

                <Route path="/messages" element={
                    <RequireAuth>
                        <Message/>
                    </RequireAuth>
                }/>

              
                <Route path="/admin" element={
                    <CheckAdmin>
                        <Moderation/>
                    </CheckAdmin>
                }/>

                <Route path="/admin/manage-user" element={
                    <CheckAdmin>
                        <UserManagement/>
                    </CheckAdmin>
                }/>

                <Route path="/admin/show-user/:id" element={
                    <CheckAdmin>
                        <ShowUser/>
                    </CheckAdmin>
                }/>

                <Route path="/admin/manage-reports" element={
                    <CheckAdmin>
                        <ReportManager/>
                    </CheckAdmin>
                }/>

                <Route path="/admin/edit-user/:id" element={
                    <CheckAdmin>
                        <EditUser/>
                    </CheckAdmin>
                }/>

                <Route path="/admin/create-user" element={
                    <CheckAdmin>
                        <CreateUser/>
                    </CheckAdmin>
                }/>

                <Route path="/admin/manage-message" element={
                    <CheckAdmin>
                        <MessageManagement/>
                    </CheckAdmin>
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
