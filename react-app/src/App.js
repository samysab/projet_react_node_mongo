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

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/confirmation">
            <Route path=":id" element={<Confirmation />} />
        </Route>
        <Route path="/resetPassword">
            <Route path=":id" element={<Reset />} />
        </Route>
      </Routes>
  );
}

export default App;
