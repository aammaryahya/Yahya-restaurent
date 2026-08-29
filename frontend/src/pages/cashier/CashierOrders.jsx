import { useEffect, useState } from "react";
import CashierLayout from "../../layouts/CashierLayout";
import { Link } from "react-router-dom";
import { socket } from "../../socket";


export default function CashierOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        socket.on("ordersUpdated", () => {
            fetchOrders();
        });

        return () => {
            socket.off("ordersUpdated");
        };
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        const list = data.orders || data;

        if (!Array.isArray(list)) return;

        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        const filtered = list.filter(o => o.status !== "cancelled");

        setOrders(filtered);
    };

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Erreur mise à jour commande");
            return;
        }

        if (status === "paid") {
            const tableId = data.order.tableId._id;

            await fetch(`http://localhost:5000/api/tables/${tableId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: "available" })
            });
        }

        fetchOrders();
    };

    // Filtrage des sections
    const readyOrders = orders.filter(o => o.status === "ready");
    const deliveredOrders = orders.filter(o => o.status === "delivered");

    return (
        <CashierLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Commandes du Caissier</h1>

                {/* READY */}
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

                            {/* Voir détails */}
                            <Link
                                to={`/cashier/orders/${order._id}`}
                                className="bg-blue-600 text-white px-3 py-1 rounded w-full text-center block"
                            >
                                Voir détails
                            </Link>
                        </div>
                    ))}
                </div>

                {/* DELIVERED */}
                <h2 className="text-xl font-bold mb-3 text-gray-600">🍽 Servies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deliveredOrders.map(order => (
                        <div key={order._id} className="bg-white shadow p-4 rounded border">

                            <h3 className="font-bold text-lg mb-2">
                                Table {order.tableId?.number}
                            </h3>

                            <p className="text-gray-600 text-sm mb-2">
                                ⏱ Depuis : {Math.floor((Date.now() - new Date(order.createdAt)) / 60000)} min
                            </p>

                            <p className="text-gray-600 font-semibold mb-2">
                                Servie
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
                            {/* Voir détails */}
                            <Link
                                to={`/cashier/orders/${order._id}`}
                                className="bg-blue-600 text-white px-3 py-1 rounded w-full text-center block"
                            >
                                Voir détails
                            </Link>

                            {/* Bouton payer */}
                            <button
                                onClick={() => updateStatus(order._id, "paid")}
                                className="bg-red-600 text-white px-3 py-1 rounded w-full"
                            >
                                Payer
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </CashierLayout>
    );
}
