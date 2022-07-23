import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import Profile from "./component/Profile";
import Users from "./component/Users";

import FriendRequest from "./component/FriendRequest";
import Friends from './component/Friends';
import User from './component/User';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile" element={<Profile/>}/>

        <Route path="/users/users" element={<Users/>}/>
        <Route path="/users/user/:id" element={<User/>} />
        <Route path="/users/friend-request" element={<FriendRequest/>}/>
        <Route path="/users/friends" element={<Friends/>}/>
      </Routes>
  );
}

export default App;
