import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import SkillExchangeMatching from "./components/SkillExchangeMatching"; // Import the new component
import ServiceRequest from "./components/ServiceRequest";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/skill-exchange"
          element={<SkillExchangeMatching />}
        />{" "}
        <Route path="/service-request" element={<ServiceRequest/>}/>
      </Routes>
    </Router>
  );
}

export default App;
