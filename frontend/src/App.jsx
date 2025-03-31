import './App.css'
import { AppRoutes } from './AppRoutes.jsx'
import RequestDetail from './components/request/RequestDetail.jsx'
import ReportForm from './components/report/Report.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {

  return (
    <AuthProvider>
      <AppRoutes />
      <RequestDetail />
      <ReportForm />
    </AuthProvider>
  )
}

export default App
