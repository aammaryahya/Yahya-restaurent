import { useEffect, useState } from "react";
import ChefLayout from "../../layouts/ChefLayout";

export default function ChefOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        // Trier : plus anciennes en premier
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setOrders(data);
    };

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem("token");

        await fetch(`http://localhost:5000/api/orders/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        fetchOrders();
    };

    // Filtrage des sections
    const readyOrders = orders.filter(o => o.status === "ready");
    const pendingOrders = orders.filter(o => o.status === "pending");
    const cancelledOrders = orders.filter(o => o.status === "cancelled");

    return (
        <ChefLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Commandes du Chef</h1>

                {/* SECTION : Ready en premier */}
                <h2 className="text-xl font-bold mb-3 text-green-600">✔ Commandes prêtes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {readyOrders.map(order => (
                        <div key={order._id} className="bg-white shadow p-4 rounded border">

                            <h3 className="font-bold text-lg mb-2">
                                Table {order.tableId?.number}
                            </h3>

                            <p className="text-gray-600 text-sm mb-2">
                                ⏱ Depuis : {Math.floor((Date.now() - new Date(order.createdAt)) / 60000)} min
                            </p>

                            <p className="text-green-600 font-semibold mb-2">
                                Commande prête
                            </p>

                            <div className="mb-3">
                                <p className="font-semibold mb-1">Items :</p>
                                <ul className="list-disc ml-5 text-gray-700">
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.menuItemId?.name} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => updateStatus(order._id, "delivered")}
                                className="bg-gray-700 text-white px-3 py-1 rounded w-full"
                            >
                                Marquer comme servie
                            </button>
                        </div>
                    ))}
                </div>

                {/* SECTION : Pending ensuite */}
                <h2 className="text-xl font-bold mb-3 text-orange-600">🧾 Commandes en attente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {pendingOrders.map(order => (
                        <div key={order._id} className="bg-white shadow p-4 rounded border">

                            <h3 className="font-bold text-lg mb-2">
                                Table {order.tableId?.number}
                            </h3>

                            <p className="text-gray-600 text-sm mb-2">
                                ⏱ Depuis : {Math.floor((Date.now() - new Date(order.createdAt)) / 60000)} min
                            </p>

                            <p className="text-orange-600 font-semibold mb-2">
                                En attente
                            </p>

                            <div className="mb-3">
                                <p className="font-semibold mb-1">Items :</p>
                                <ul className="list-disc ml-5 text-gray-700">
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.menuItemId?.name} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* ❌ Le serveur ne peut PAS commencer → on enlève le bouton */}
                            <button
                                onClick={() => updateStatus(order._id, "cancelled")}
                                className="bg-red-600 text-white px-3 py-1 rounded w-full"
                            >
                                Annuler
                            </button>
                        </div>
                    ))}
                </div>

                {/* SECTION : Cancelled */}
                <h2 className="text-xl font-bold mb-3 text-red-600">❌ Commandes annulées</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cancelledOrders.map(order => (
                        <div key={order._id} className="bg-white shadow p-4 rounded border">

                            <h3 className="font-bold text-lg mb-2">
                                Table {order.tableId?.number}
                            </h3>

                            <p className="text-gray-600 text-sm mb-2">
                                ⏱ Depuis : {Math.floor((Date.now() - new Date(order.createdAt)) / 60000)} min
                            </p>

                            <p className="text-red-600 font-semibold mb-2">
                                Commande annulée
                            </p>

                            <div className="mb-3">
                                <p className="font-semibold mb-1">Items :</p>
                                <ul className="list-disc ml-5 text-gray-700">
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.menuItemId?.name} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ChefLayout>
    );
}
