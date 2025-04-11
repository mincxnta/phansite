import './App.css'
import { AppRoutes } from './AppRoutes.jsx'
import RequestDetail from './components/request/RequestDetail.jsx'
import ReportPopup from './components/popups/ReportPopup.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter as Router } from 'react-router-dom';
import { PopUp } from './components/popups/PopUp.jsx'
import { RequestPopup } from './components/popups/RequestPopup.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <Router>
      <ToastContainer position="top-center"/>
      <AuthProvider>
        <AppRoutes />
        <RequestDetail />
        <ReportPopup />
        <PopUp />
        <RequestPopup/>
      </AuthProvider>
    </Router>
  )
}

export default App
