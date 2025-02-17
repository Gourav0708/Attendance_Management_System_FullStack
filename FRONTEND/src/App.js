
import React from 'react'
import SignUP from './Componenets/SignUP'
import LoginPage from './Componenets/LoginPage'
import Dashboard from './Componenets/Dashboard';
import { ToastContainer} from 'react-toastify'
import {
  BrowserRouter as Router,
  Routes,
  Route

} from "react-router-dom";

const App = () => {
  
  return (
    <>
    <ToastContainer/>
    <Router>
    <Routes>
      <Route exact path ="/signup" element={<SignUP category="SignUp"/>}/>
      <Route exact path ="/" element={<LoginPage category="Login"/>}/>
      <Route exact path="/dashboard" element={<Dashboard key="Dashboard" category="Dashboard" />} />
      </Routes>
      </Router>
    </>

  );
}

export default App;
