import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/login/LoginPage"
import PartsListPage from "../pages/boss/PartsListPage"
import AddPartPage from "../pages/boss/AddPartPage"
import PartRequestsPage from "../pages/boss/PartRequestsPage"
import MechanicHome from "../pages/mechanic/MechanicHome"
import ProtectedRoute from "./ProtectedRoute"
import BossLayout from "../layouts/BossLayout"
import MechanicsListPage from "../pages/boss/MechanicsListPage"
import AddMechanicPage from "../pages/boss/AddMechanicPage"
import CarsListPage from "../pages/boss/CarListPage"
import AddCarPage from "../pages/boss/AddCarPage"

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
        <Route path="parts" element={<PartsListPage />} />
        <Route path="parts/new" element={<AddPartPage />} />
        <Route path="part-requests" element={<PartRequestsPage />} />
        <Route path="cars" element={<CarsListPage />} />
        <Route path="cars/new" element={<AddCarPage />} />
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
