import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ChefLayout from "../layouts/ChefLayout";

export default function Chef() {
    const [pending, setPending] = useState(0);
    const [preparing, setPreparing] = useState(0);
    const [lowStock, setLowStock] = useState(0);
    const [unavailable, setUnavailable] = useState(0);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchDashboardData();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        const token = localStorage.getItem("token");

        // Commandes
        const ordersRes = await fetch("http://localhost:5000/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const orders = await ordersRes.json();

        setPending(orders.filter(o => o.status === "pending").length);
        setPreparing(orders.filter(o => o.status === "preparing").length);

        // Stock critique
        const stockRes = await fetch("http://localhost:5000/api/inventory", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const stock = await stockRes.json();

        setLowStock(stock.filter(i => i.stock < i.minStock).length);

        // Plats indisponibles
        const menuRes = await fetch("http://localhost:5000/api/menu", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const menu = await menuRes.json();

        setUnavailable(menu.filter(m => !m.available).length);
    };

    return (
        <ChefLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Dashboard Chef</h1>

                {/* GRID 2 PAR LIGNE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Commandes en attente */}
                    <div className="bg-white shadow p-6 rounded border">
                        <h2 className="text-xl font-bold mb-2">🧾 Commandes en attente</h2>
                        <p className="text-4xl font-bold text-orange-600">{pending}</p>
                        <p className="text-gray-600 mt-2">En attente de préparation</p>
                    </div>

                    {/* Commandes en préparation */}
                    <div className="bg-white shadow p-6 rounded border">
                        <h2 className="text-xl font-bold mb-2">👨‍🍳 En préparation</h2>
                        <p className="text-4xl font-bold text-blue-600">{preparing}</p>
                        <p className="text-gray-600 mt-2">Actuellement en cuisine</p>
                    </div>

                    {/* Stock critique */}
                    <div className="bg-white shadow p-6 rounded border">
                        <h2 className="text-xl font-bold mb-2">📦 Stock critique</h2>
                        <p className="text-4xl font-bold text-red-600">{lowStock}</p>
                        <p className="text-gray-600 mt-2">Ingrédients sous le minimum</p>
                    </div>

                    {/* Plats indisponibles */}
                    <div className="bg-white shadow p-6 rounded border">
                        <h2 className="text-xl font-bold mb-2">📋 Plats indisponibles</h2>
                        <p className="text-4xl font-bold text-red-700">{unavailable}</p>
                        <p className="text-gray-600 mt-2">À réactiver si possible</p>
                    </div>

                </div>
            </div>
        </ChefLayout>
    );
}
