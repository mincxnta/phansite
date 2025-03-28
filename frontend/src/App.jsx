import './App.css'
import { AppRoutes } from './AppRoutes.jsx'
import RequestDetail from './components/request/RequestDetail.jsx'
import ReportForm from './components/report/Report.jsx'

function App() {

  return (
    <>
      <AppRoutes />
      <RequestDetail />
      <ReportForm />
    </>
  )
}

export default App
