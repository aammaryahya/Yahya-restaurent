import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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

        const response = await fetch("http://localhost:5000/api/orders", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        setOrders(data);
    };

    const deleteOrder = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            setConfirmDeleteId(null);
            fetchOrders();
        }
    };

    const filteredOrders = orders.filter((order) => {
        const q = search.toLowerCase().trim();

        const matchesSearch =
            order.tableId?.number?.toString().includes(q) ||
            order.status.toLowerCase().includes(q);

        const matchesStatus =
            statusFilter === "" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="p-6">

                <h1 className="text-2xl font-bold mb-4">Commandes</h1>

                {/* Recherche */}
                <input
                    type="text"
                    placeholder="Rechercher par table ou statut..."
                    className="border p-2 rounded w-full mb-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Filtre statut */}
                <select
                    className="border p-2 rounded mb-4"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="preparing">En préparation</option>
                    <option value="ready">Prête</option>
                    <option value="delivered">Servie</option>
                    <option value="cancelled">Annulée</option>
                </select>

                {/* Tableau */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-2 border">Table</th>
                            <th className="p-2 border">Total</th>
                            <th className="p-2 border">Items</th>
                            <th className="p-2 border">Statut</th>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="border">
                                <td className="p-2 border">
                                    Table {order.tableId?.number}
                                </td>

                                <td className="p-2 border">
                                    {order.total.toFixed(2)} $
                                </td>

                                <td className="p-2 border">
                                    {order.items.length} items
                                </td>

                                <td className="p-2 border">
                                    <span
                                        className={
                                            order.status === "pending"
                                                ? "text-yellow-600 font-semibold"
                                                : order.status === "preparing"
                                                    ? "text-blue-600 font-semibold"
                                                    : order.status === "ready"
                                                        ? "text-green-600 font-semibold"
                                                        : order.status === "delivered"
                                                            ? "text-purple-600 font-semibold"
                                                            : "text-red-600 font-semibold"
                                        }
                                    >
                                        {order.status}
                                    </span>
                                </td>

                                <td className="p-2 border">
                                    {new Date(order.createdAt).toLocaleString()}
                                </td>

                                <td className="p-2 border">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        Détails
                                    </button>

                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => setConfirmDeleteId(order._id)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Détails */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Détails de la commande</h2>

                        <p><strong>Table :</strong> {selectedOrder.tableId?.number}</p>
                        <p><strong>Total :</strong> {selectedOrder.total.toFixed(2)} $</p>
                        <p><strong>Statut :</strong> {selectedOrder.status}</p>
                        <p><strong>Notes :</strong> {selectedOrder.notes || "Aucune"}</p>

                        <h3 className="font-semibold mt-4 mb-2">Items :</h3>
                        <ul className="list-disc ml-6">
                            {selectedOrder.items.map((item, index) => (
                                <li key={index}>
                                    {item.quantity} × {item.menuItemId?.name} — {item.price} $
                                </li>
                            ))}
                        </ul>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation suppression */}
            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80">
                        <h2 className="text-xl font-bold mb-4">Supprimer ?</h2>
                        <p className="mb-4">Voulez-vous vraiment supprimer cette commande ?</p>

                        <div className="flex justify-between">
                            <button
                                onClick={() => deleteOrder(confirmDeleteId)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Oui, supprimer
                            </button>

                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
