import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import PartsListPage from "../pages/boss/PartsListPage";
import AddPartPage from "../pages/boss/AddPartPage";
import PartRequestsPage from "../pages/boss/PartRequestsPage";
import ProtectedRoute from "./ProtectedRoute";
import BossLayout from "../layouts/BossLayout";
import MechanicsListPage from "../pages/boss/MechanicsListPage";
import AddMechanicPage from "../pages/boss/AddMechanicPage";
import CarsListPage from "../pages/boss/CarListPage";
import AddCarPage from "../pages/boss/AddCarPage";
import CarHistoryPage from "../pages/boss/CarHistoryPage";
import JobsListPage from "../pages/boss/JobListPage";
import JobDetailsPage from "../pages/boss/JobDetailsPage";
import MechanicLayout from "../layouts/MechanicLayout";
import MyJobsPage from "../pages/mechanic/MyJobsPage";
import SalaryReportPage from "../pages/boss/SalaryReportPage";
import MechanicPartRequestsPage from "../pages/mechanic/PartRequestsPage";
import FinanceDashboardPage from "../pages/boss/FinanceDashboardPage";
import CustomerListPage from "../pages/boss/CustomerListPage";
import CustomerDetailsPage from "../pages/boss/CustomerDetailsPage";
import RegisterCustomerPage from "../pages/login/RegisterCustomerPage";
import CustomerLayout from "../layouts/CustomerLayout";
import MyCarsPage from "../pages/customer/MyCarsPage";
import CustomerCarFormPage from "../pages/customer/CustomerCarFormPage";
import CreateProblemPage from "../pages/customer/CreateProblemPage";
import CustomerProblemsPage from "../pages/customer/CustomerProblemsPage";
import AssignedProblemsPage from "../pages/mechanic/AssignedProblemsPage";
import CreateProblemJobPage from "../pages/mechanic/CreateProblemJobPage";
import NotificationsPage from "../pages/NotificationsPage";
import AppointmentsPage from "../pages/boss/AppointmentsPage";
import InvoicesPage from "../pages/InvoicesPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterCustomerPage />} />

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
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="customers/:id" element={<CustomerDetailsPage />} />
        <Route path="cars" element={<CarsListPage />} />
        <Route path="cars/new" element={<AddCarPage />} />
        <Route path="cars/:id" element={<CarHistoryPage />} />
        <Route path="jobs" element={<JobsListPage />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="invoices" element={<InvoicesPage role="boss" />} />
        <Route path="salaries" element={<SalaryReportPage />} />
        <Route path="finance" element={<FinanceDashboardPage />} />
      </Route>

      <Route
        path="/mechanic"
        element={
          <ProtectedRoute allow="MECHANIC">
            <MechanicLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/mechanic/jobs" replace />} />
        <Route path="jobs" element={<MyJobsPage />} />
        <Route path="part-requests" element={<MechanicPartRequestsPage />} />
        <Route path="problems" element={<AssignedProblemsPage />} />
        <Route path="problems/:id/job" element={<CreateProblemJobPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/customer" element={<ProtectedRoute allow="CUSTOMER"><CustomerLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/customer/cars" replace />} />
        <Route path="cars" element={<MyCarsPage />} />
        <Route path="cars/new" element={<CustomerCarFormPage />} />
        <Route path="cars/:id/edit" element={<CustomerCarFormPage />} />
        <Route path="problems" element={<CustomerProblemsPage />} />
        <Route path="problems/new" element={<CreateProblemPage />} />
        <Route path="invoices" element={<InvoicesPage role="customer" />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
