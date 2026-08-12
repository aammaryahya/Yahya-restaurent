import { Link } from "react-router-dom";

export default function AdminSidebar() {
    return (
        <div className="w-64 bg-red-600 text-white min-h-screen p-5">
            <h2 className="text-2xl font-bold mb-8 text-white">Admin Panel</h2>

            <nav className="flex flex-col gap-3">
                <Link className="p-2 rounded hover:bg-gray-700" to="/admin">📊 Dashboard</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/admin/employees">👥 Employés</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/admin/tables">🍽️ Tables</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/admin/menu">📋 Menu</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/admin/orders">🧾 Commandes</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/admin/inventory">📦 Inventaire</Link>
            </nav>
        </div>
    );
}
