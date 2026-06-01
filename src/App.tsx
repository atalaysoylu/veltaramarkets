import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './HomePage'
import LiveAccountLayout from './LiveAccountLayout'
import LiveAccountAuthScreen from './LiveAccountAuthScreen'
import ForgotPasswordScreen from './ForgotPasswordScreen'
import LiveAccountPanelScreen from './LiveAccountPanelScreen'
import WithdrawRequestScreen from './WithdrawRequestScreen'
import DepositFlowScreen from './DepositFlowScreen'
import { ProtectedLiveRoute } from './ProtectedLiveRoute'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/live-account" element={<LiveAccountLayout />}>
        <Route index element={<LiveAccountAuthScreen />} />
        <Route path="forgot-password" element={<ForgotPasswordScreen />} />
        <Route
          path="panel"
          element={
            <ProtectedLiveRoute>
              <LiveAccountPanelScreen />
            </ProtectedLiveRoute>
          }
        />
        <Route
          path="withdraw"
          element={
            <ProtectedLiveRoute>
              <WithdrawRequestScreen />
            </ProtectedLiveRoute>
          }
        />
        <Route
          path="deposit"
          element={
            <ProtectedLiveRoute>
              <DepositFlowScreen />
            </ProtectedLiveRoute>
          }
        />
      </Route>
      <Route path="/payment" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
