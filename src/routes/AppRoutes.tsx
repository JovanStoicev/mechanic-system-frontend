import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/login/LoginPage"
import BossHome from "../pages/boss/BossHome"
import MechanicHome from "../pages/mechanic/MechanicHome"
import ProtectedRoute from "./ProtectedRoute"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/boss"
        element={
          <ProtectedRoute allow="BOSS">
            <BossHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mechanic"
        element={
          <ProtectedRoute allow="MECHANIC">
            <MechanicHome />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
