import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import Waiter from "./pages/Waiter.jsx";
import Chef from "./pages/Chef.jsx";
import Cashier from "./pages/Cashier.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

//Admin pages
import Employees from "./pages/admin/Employees.jsx";
import Tables from "./pages/admin/Tables.jsx";
import Menu from "./pages/admin/Menu.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Inventory from "./pages/admin/Inventory.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page Login */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/*Pages admin*/}

        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute requiredRole="admin">
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute requiredRole="admin">
              <Tables />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute requiredRole="admin">
              <Menu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute requiredRole="admin">
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/waiter"
          element={
            <ProtectedRoute role="waiter">
              <Waiter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chef"
          element={
            <ProtectedRoute role="chef">
              <Chef />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cashier"
          element={
            <ProtectedRoute role="cashier">
              <Cashier />
            </ProtectedRoute>
          }
        />

        {/* Route par défaut */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
