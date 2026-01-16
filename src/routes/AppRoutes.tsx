import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/login/LoginPage"
import BossHome from "../pages/boss/BossHome"
import MechanicHome from "../pages/mechanic/MechanicHome"
import ProtectedRoute from "./ProtectedRoute"
import BossLayout from "../layouts/BossLayout"
import MechanicsListPage from "../pages/boss/MechanicsListPage"
import AddMechanicPage from "../pages/boss/AddMechanicPage"


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/boss"
        element={
          <ProtectedRoute allow="BOSS">
            <BossLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/boss/mechanics" replace />} />
        <Route path="mechanics" element={<MechanicsListPage />} />
        <Route path="mechanics/new" element={<AddMechanicPage />} />
      </Route>

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
