import { Route, Routes } from 'react-router-dom'
import HomePage from './HomePage'
import LiveAccountPage from './LiveAccountPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/live-account" element={<LiveAccountPage />} />
    </Routes>
  )
}
