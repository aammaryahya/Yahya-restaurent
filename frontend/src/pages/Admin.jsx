import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Link } from "react-router-dom";


export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");

        const [ordersRes, tablesRes, ingredientsRes, menuRes] = await Promise.all([
            fetch("http://localhost:5000/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:5000/api/tables", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:5000/api/inventory", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:5000/api/menu", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setOrders(await ordersRes.json());
        setTables(await tablesRes.json());
        setIngredients(await ingredientsRes.json());
        setMenuItems(await menuRes.json());
    };

    // KPIs
    const today = new Date().toISOString().split("T")[0];

    const ordersToday = orders.filter(o => o.createdAt.startsWith(today));
    const revenueToday = ordersToday.reduce((sum, o) => sum + o.total, 0);

    const occupiedTables = tables.filter(t => t.status === "occupied").length;
    const freeTables = tables.filter(t => t.status === "available").length;

    const lowStockCount = ingredients.filter(i => i.stock < i.minStock).length;
    const unavailableMenuItems = menuItems.filter(i => !i.available).length;

    // Commandes récentes
    const recentOrders = orders.slice(-5).reverse();

    return (
        <AdminLayout>
            <div className="p-6">

                <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">

                    <div className="bg-white shadow p-4 rounded">
                        <h3 className="text-sm text-gray-500">Commandes aujourd’hui</h3>
                        <p className="text-2xl font-bold">{ordersToday.length}</p>
                    </div>

                    <div className="bg-white shadow p-4 rounded">
                        <h3 className="text-sm text-gray-500">Revenus aujourd’hui</h3>
                        <p className="text-2xl font-bold">{revenueToday.toFixed(2)} $</p>
                    </div>

                    <div className="bg-white shadow p-4 rounded">
                        <h3 className="text-sm text-gray-500">Tables occupées</h3>
                        <p className="text-2xl font-bold">{occupiedTables}</p>
                    </div>

                    <div className="bg-white shadow p-4 rounded">
                        <h3 className="text-sm text-gray-500">Tables libres</h3>
                        <p className="text-2xl font-bold">{freeTables}</p>
                    </div>

                    <div className="bg-white shadow p-4 rounded">
                        <h3 className="text-sm text-gray-500">Stock bas</h3>
                        <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
                    </div>

                    <div className="bg-white shadow p-4 rounded">
                        <h3 className="text-sm text-gray-500">Menus indisponibles</h3>
                        <p className="text-2xl font-bold text-red-600">{unavailableMenuItems}</p>
                    </div>
                </div>

                {/* Commandes récentes */}
                <div className="bg-white shadow p-4 rounded mb-6">
                    <h2 className="text-xl font-bold mb-4">Commandes récentes</h2>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-2 border">Table</th>
                                <th className="p-2 border">Total</th>
                                <th className="p-2 border">Statut</th>
                                <th className="p-2 border">Heure</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order._id} className="border">
                                    <td className="p-2 border">Table {order.tableId?.number}</td>
                                    <td className="p-2 border">{order.total.toFixed(2)} $</td>
                                    <td className="p-2 border">{order.status}</td>
                                    <td className="p-2 border">
                                        {new Date(order.createdAt).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Stock bas */}
                <div className="bg-white shadow p-4 rounded mb-6">
                    <h2 className="text-xl font-bold mb-4">Stock bas</h2>

                    {lowStockCount === 0 ? (
                        <p className="text-gray-500">Aucun ingrédient en stock bas.</p>
                    ) : (
                        <ul className="list-disc ml-6">
                            {ingredients
                                .filter(i => i.stock < i.minStock)
                                .map(i => (
                                    <li key={i._id}>
                                        {i.name} — {i.stock}{i.unit} (min {i.minStock}{i.unit})
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>

                {/* Actions rapides */}
                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-xl font-bold mb-4">Actions rapides</h2>

                    <div className="flex flex-wrap gap-4">
                        <Link to="/admin/menu" className="bg-blue-600 text-white px-4 py-2 rounded">
                            Gérer le menu
                        </Link>

                        <Link to="/admin/inventory" className="bg-green-600 text-white px-4 py-2 rounded">
                            Gérer l’inventaire
                        </Link>

                        <Link to="/admin/orders" className="bg-purple-600 text-white px-4 py-2 rounded">
                            Voir les commandes
                        </Link>

                        <Link to="/admin/employees" className="bg-orange-600 text-white px-4 py-2 rounded">
                            Gérer les employés
                        </Link>
                    </div>
                </div>


            </div>
        </AdminLayout>
    );
}