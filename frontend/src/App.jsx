import './App.css'
import React from 'react'
import { AppRoutes } from './AppRoutes.jsx'
import RequestDetail from './views/request/RequestDetail.jsx'
import ReportPopup from './views/popups/ReportPopup.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter as Router } from 'react-router-dom';
import { RequestPopup } from './views/popups/RequestPopup.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MusicPlayer } from './components/MusicPlayer.jsx'
import './assets/styles/ToastStyles.css'
import { MusicPlayerProvider } from './context/MusicPlayerContext.jsx'

function App() {
  return (
    <Router>
      <MusicPlayerProvider>
        <ToastContainer position="bottom-left" 
        icon={({ type }) => {
          switch (type) {
            case 'error':
              return <img src='/assets/images/icons/error.png'/>
            case 'success':
              return <img src='/assets/images/icons/success.png'/>;
            default:
              return null;
          }
        }}
        />
        <AuthProvider>
          <AppRoutes/>
          <MusicPlayer/>
          <RequestDetail />
          <ReportPopup />
          <RequestPopup />
        </AuthProvider>
      </MusicPlayerProvider>
    </Router>
  )
}

export default App
