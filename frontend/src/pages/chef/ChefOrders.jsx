import { useEffect, useState } from "react";
import ChefLayout from "../../layouts/ChefLayout";

export default function ChefOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrders();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        // Le chef voit seulement pending + preparing
        const filtered = data.filter(o =>
            o.status === "pending" || o.status === "preparing"
        );

        // Trier : plus anciennes en premier
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setOrders(filtered);
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

    return (
        <ChefLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Commandes à préparer</h1>

                {/* GRID 2 PAR LIGNE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white shadow p-4 rounded border">

                            {/* HEADER */}
                            <h2 className="font-bold text-lg mb-2">
                                Table {order.tableId?.number}
                            </h2>

                            {/* TEMPS */}
                            <p className="text-gray-600 text-sm mb-2">
                                ⏱ Depuis : {Math.floor((Date.now() - new Date(order.createdAt)) / 60000)} min
                            </p>

                            {/* NOTE */}
                            {order.notes && (
                                <p className="text-yellow-700 font-semibold mb-2">
                                    📝 Note : {order.notes}
                                </p>
                            )}

                            {/* ITEMS */}
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

                            {/* STATUT */}
                            <p className="text-gray-600 mb-3">
                                Statut :{" "}
                                <span className={order.status === "pending" ? "text-orange-600" : "text-blue-600"}>
                                    {order.status}
                                </span>
                            </p>

                            {/* BOUTONS */}
                            <div className="mt-3 flex gap-3">
                                {order.status === "pending" && (
                                    <button
                                        onClick={() => updateStatus(order._id, "preparing")}
                                        className="bg-blue-600 text-white px-3 py-1 rounded w-full"
                                    >
                                        Commencer
                                    </button>
                                )}

                                {order.status === "preparing" && (
                                    <button
                                        onClick={() => updateStatus(order._id, "ready")}
                                        className="bg-green-600 text-white px-3 py-1 rounded w-full"
                                    >
                                        Prêt
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ChefLayout>
    );
}
