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
import SkillCreditSystem from "./components/SkillCreditSystem";
import MilestoneTracking from "./components/MilestoneTracking";
import SecureAgreement from "./components/SecureAgreement";
import AuthProvider from "./components/AuthProvider";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
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
            <Route path="/service-request" element={<ServiceRequest />} />
            <Route path="/skill-credit" element={<SkillCreditSystem />} />
            <Route path="/milestone" element={<MilestoneTracking />} />
            <Route path="/agreement" element={<SecureAgreement />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
