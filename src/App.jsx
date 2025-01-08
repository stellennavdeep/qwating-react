import { BrowserRouter, Route, Routes } from 'react-router-dom';
import qs from 'qs'; 
import './App.css';
import Dashboard from "./CallScreen/Dashboard/Dashboard.jsx";
import Login from "./CallScreen/Auth/Login.jsx";

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route index element={<Login />} />
          <Route path="Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
