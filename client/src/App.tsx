import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import ErrorPage from "./_global/ErrorPage";
import ForbiddenPage from "./_global/ForbiddenPage";
import Login from "./_auth/pages/Login";
import WebAppLayout from "./_webapp/layouts/WebAppLayout";
import Dashboard from "./_webapp/pages/Dashboard";
import TicketManagement from "./_webapp/pages/TicketManagement";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <main className="flex min-h-screen">
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<ForbiddenPage />} />

        {/* Admin Protected Routes */}
        <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<WebAppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketManagement />} />
          </Route>
        </Route>

        {/* Error / Global Page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </main>
  );
}

export default App;