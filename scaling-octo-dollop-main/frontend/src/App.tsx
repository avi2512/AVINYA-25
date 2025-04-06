
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/login'
import { ItemDetail } from './pages/Item'
import { LostItemsDashboard } from './pages/lostItems'
import { ReportItem } from './pages/ReportItem'
import { SearchLostItems } from './pages/SearchLostItems'

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/item/:id" element={<ItemDetail />} />
      <Route path="/lost-items" element={<LostItemsDashboard />} />
      <Route path="/report-lost-item" element={<ReportItem />} />
      <Route path="/search" element={<SearchLostItems />} />
    </Routes>
  </BrowserRouter>
}

export default App





