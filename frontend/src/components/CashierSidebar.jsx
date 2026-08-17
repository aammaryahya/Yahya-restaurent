import { Link } from "react-router-dom";

export default function CashierSidebar() {
    return (
        <div className="w-50 bg-red-600 text-white min-h-screen p-5">
            <h2 className="text-2xl font-bold mb-8 text-white">Caissier Panel</h2>

            <nav className="flex flex-col gap-3">
                <Link className="p-2 rounded hover:bg-gray-700" to="/cashier">
                    📊 Dashboard
                </Link>

                <Link className="p-2 rounded hover:bg-gray-700" to="/cashier/orders">
                    🧾 Commandes
                </Link>
            </nav>
        </div>
    );
}
