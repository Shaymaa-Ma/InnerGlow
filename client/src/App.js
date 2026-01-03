// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import FindTherapist from "./pages/FindTherapist";
import Information from "./pages/Information";
import MoodJournal from "./pages/MoodJournal";
import StressDetection from "./pages/StressDetection";
import Meditation from "./pages/Meditation";
import Exercises from "./pages/Exercises";
import Diet from "./pages/Diet";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./context/AuthContext";
import BookAppointment from "./pages/BookAppointment";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/information" element={<Information />} />
          <Route path="/mood" element={<MoodJournal />} />
          <Route path="/stress" element={<StressDetection />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/findtherapist" element={<FindTherapist />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
