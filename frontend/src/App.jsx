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

//Chef pages
import ChefOrders from "./pages/chef/ChefOrders.jsx";
import ChefInventory from "./pages/chef/ChefInventory.jsx";
import MenuStatus from "./pages/chef/MenuStatus.jsx";

//Waiter pages
import WaiterTables from "./pages/waiter/WaiterTables.jsx";
import WaiterOrders from "./pages/waiter/WaiterOrders.jsx";
import WaiterCreateOrders from "./pages/waiter/WaiterCreateOrder.jsx";


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
          path="/chef"
          element={
            <ProtectedRoute role="chef">
              <Chef />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chef/orders"
          element={
            <ProtectedRoute role="chef">
              <ChefOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chef/inventory"
          element={
            <ProtectedRoute role="chef">
              <ChefInventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chef/menu-status"
          element={
            <ProtectedRoute role="chef">
              <MenuStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/waiter"
          element={
            <ProtectedRoute requiredRole="waiter">
              <Waiter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/waiter/orders"
          element={
            <ProtectedRoute requiredRole="waiter">
              <WaiterOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/waiter/tables"
          element={
            <ProtectedRoute requiredRole="waiter">
              <WaiterTables />
            </ProtectedRoute>
          }
        />

        <Route
          path="/waiter/create-order"
          element={
            <ProtectedRoute requiredRole="waiter">
              <WaiterCreateOrders />
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
