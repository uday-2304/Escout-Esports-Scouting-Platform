import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  BrowserRouter,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Title from "./components/Titles/Title";
import Program from "./components/programs/program";
import Footer from "./components/Footer/Footer";
import LiveStats from "./components/Counter/LiveStats";
import AboutSection from "./components/Info/AboutSection";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AuthPage from "./pages/Logins";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ArenaHub from "./pages/ArenaHub";
import OtpPage from "./pages/OtpPage";
import AddVideo from "./pages/AddVideo";
import ResetPasswordPage from "./pages/resetPassword";

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-screen flex flex-col">
      <Navbar />
      {isHome && (
        <>
          <Hero/>
          <Title
            title="Enter the Arena of Champions"
            SubTitle="Explore the worlds most intense competitive games — from tactical shooters to legendary battle arenas."
          />
          <Program/>
          <LiveStats/>
          <AboutSection/>
          <Footer/>
        </>
      )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Notifications />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/arena-hub" element={<ArenaHub />} />
          <Route path="/add-video" element={<AddVideo />} />
        </Routes>

    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
