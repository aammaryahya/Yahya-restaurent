import { Link } from "react-router-dom";

export default function WaiterSidebar() {
    return (
        <div className="w-50 bg-red-600 text-white min-h-screen p-5">
            <h2 className="text-2xl font-bold mb-8 text-white">Serveur Panel</h2>

            <nav className="flex flex-col gap-3">
                <Link className="p-2 rounded hover:bg-gray-700" to="/waiter">📊 Dashboard</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/waiter/orders">🧾 Commandes</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/waiter/tables">🍽️ Tables</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/waiter/create-order">📋 Créer une commande</Link>
                <Link className="p-2 rounded hover:bg-gray-700" to="/waiter/waiterInventory">📋 Inventaire</Link>

            </nav>
        </div>
    );
}
