import { useEffect, useState } from "react";
import WaiterLayout from "../layouts/WaiterLayout";

export default function Waiter() {
    const [pending, setPending] = useState(0);
    const [preparing, setPreparing] = useState(0);
    const [ready, setReady] = useState(0);
    const [delivered, setDelivered] = useState(0);

    const [lowStock, setLowStock] = useState(0);
    const [unavailable, setUnavailable] = useState(0);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        const token = localStorage.getItem("token");

        const ordersRes = await fetch("http://localhost:5000/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const orders = await ordersRes.json();

        if (!Array.isArray(orders)) {
            console.log("Erreur API commandes:", orders);
            return;
        }

        setPending(orders.filter(o => o.status === "pending").length);
        setPreparing(orders.filter(o => o.status === "preparing").length);
        setReady(orders.filter(o => o.status === "ready").length);
        setDelivered(orders.filter(o => o.status === "delivered").length);

        const stockRes = await fetch("http://localhost:5000/api/inventory", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const stock = await stockRes.json();

        if (!Array.isArray(stock)) {
            console.log("Erreur API inventaire:", stock);
            return;
        }

        setLowStock(stock.filter(i => i.stock < i.minStock).length);

        const menuRes = await fetch("http://localhost:5000/api/menu", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const menu = await menuRes.json();

        if (!Array.isArray(menu)) {
            console.log("Erreur API menu:", menu);
            return;
        }

        setUnavailable(menu.filter(m => !m.available).length);
    };

    return (
        <WaiterLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Dashboard Serveur</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="bg-white shadow p-6 rounded border">
                        <h2 className="text-xl font-bold mb-2">🧾 Commandes en attente</h2>
                        <p className="text-4xl font-bold text-orange-600">{pending}</p>
                    </div>

                    <div className="bg-white shadow p-6 rounded border">
                        <h2 className="text-xl font-bold mb-2">👨‍🍳 En préparation</h2>
                        <p className="text-4xl font-bold text-blue-600">{preparing}</p>
                    </div>

                    <div className="bg-white shadow p-6 rounded border">
                        <h2 className="text-xl font-bold mb-2">✔ Prêtes</h2>
                        <p className="text-4xl font-bold text-green-600">{ready}</p>
                    </div>

                    <div className="bg-white shadow p-6 rounded border">
                        <h2 className="text-xl font-bold mb-2">🍽 Servies</h2>
                        <p className="text-4xl font-bold text-gray-600">{delivered}</p>
                    </div>

                    <div className="bg-white shadow p-6 rounded border">
                        <h2 className="text-xl font-bold mb-2">📦 Stock critique</h2>
                        <p className="text-4xl font-bold text-red-600">{lowStock}</p>
                    </div>

                    <div className="bg-white shadow p-6 rounded border">
                        <h2 className="text-xl font-bold mb-2">📋 Plats indisponibles</h2>
                        <p className="text-4xl font-bold text-red-700">{unavailable}</p>
                    </div>

                </div>
            </div>
        </WaiterLayout>
    );
}
