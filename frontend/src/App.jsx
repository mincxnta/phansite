import './App.css'
import React, { useState } from 'react'
import { AppRoutes } from './AppRoutes.jsx'
import RequestDetail from './components/request/RequestDetail.jsx'
import ReportPopup from './components/popups/ReportPopup.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter as Router } from 'react-router-dom';
import { PopUp } from './components/popups/PopUp.jsx'
import { RequestPopup } from './components/popups/RequestPopup.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackgroundMusic from './components/BackgroundMusic.jsx';

function App() {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <Router>
      <BackgroundMusic isMuted={isMuted} volume={volume} />
      <ToastContainer position="top-center"/>
      <AuthProvider>
        <AppRoutes isMuted={isMuted} toggleMute={toggleMute} volume={volume} setVolume={setVolume}/>
        <RequestDetail />
        <ReportPopup />
        <PopUp />
        <RequestPopup/>
      </AuthProvider>
    </Router>
  )
}

export default App
