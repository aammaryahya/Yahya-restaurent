import { useEffect, useState } from "react";
import WaiterLayout from "../../layouts/WaiterLayout";
import { Link } from "react-router-dom";

export default function WaiterTables() {
    const [tables, setTables] = useState([]);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/tables", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setTables(data);
    };

    const getStatusColor = (status) => {
        if (status === "available") return "text-green-600";
        if (status === "occupied") return "text-orange-600";
        if (status === "reserved") return "text-blue-600";
        return "text-gray-600";
    };

    return (
        <WaiterLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Tables</h1>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {tables.map(table => (
                        <div key={table._id} className="bg-white shadow p-4 rounded border">

                            {/* Numéro de table */}
                            <h2 className="font-bold text-lg mb-2">
                                Table {table.number}
                            </h2>

                            {/* Statut */}
                            <p className="text-gray-600 mb-3">
                                Statut :{" "}
                                <span className={getStatusColor(table.status)}>
                                    {table.status}
                                </span>
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">

                                {/* Si la table est disponible → créer commande */}
                                {table.status === "available" && (
                                    <Link
                                        to={`/waiter/create-order/${table._id}`}
                                        className="bg-green-600 text-white px-3 py-2 rounded text-center"
                                    >
                                        Créer commande
                                    </Link>
                                )}

                                {/* Si la table est occupée → voir commande */}
                                {table.status === "occupied" && (
                                    <Link
                                        to={`/waiter/orders?table=${table._id}`}
                                        className="bg-orange-600 text-white px-3 py-2 rounded text-center"
                                    >
                                        Voir commande
                                    </Link>
                                )}

                                {/* Si la table est réservée */}
                                {table.status === "reserved" && (
                                    <button className="bg-blue-600 text-white px-3 py-2 rounded">
                                        Réservée
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WaiterLayout>
    );
}
