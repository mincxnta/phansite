import './App.css'
import { AppRoutes } from './AppRoutes.jsx'
import RequestDetail from './components/request/RequestDetail.jsx'
import ReportForm from './components/report/Report.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter as Router } from 'react-router-dom';
import { PopUp } from './components/PopUp.jsx'

function App() {

  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <RequestDetail />
        <ReportForm />
        <PopUp />
      </AuthProvider>
    </Router>
  )
}

export default App
