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

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile" element={<Profile/>}/>

        <Route path="/users" element={<Users/>}/>
        <Route path="/users/friend-request" element={<FriendRequest/>}/>
      </Routes>
  );
}

export default App;
