import { Route, Routes } from 'react-router-dom'
import HomePage from './HomePage'
import LiveAccountPage from './LiveAccountPage'
import PaymentPage from './PaymentPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/live-account" element={<LiveAccountPage />} />
      <Route path="/payment" element={<PaymentPage />} />
    </Routes>
  )
}
