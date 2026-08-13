import { Link } from "react-router-dom";

export default function ChefSidebar() {
    return (
        <div className="w-50 bg-red-600 text-white min-h-screen p-5">
            <h2 className="text-2xl font-bold mb-8 text-white">Chef Panel</h2>

            <nav className="flex flex-col gap-3">
                <Link className="p-2 rounded hover:bg-gray-700" to="/chef">📊 Dashboard</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/chef/orders">🧾 Commandes</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/chef/inventory">📦 Stock</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/chef/menu-status">📋 Plats</Link>
            </nav>
        </div>
    );
}
