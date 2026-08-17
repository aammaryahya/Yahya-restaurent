import { useEffect, useState } from "react";
import WaiterLayout from "../../layouts/WaiterLayout";
import { Link } from "react-router-dom";

export default function WaiterTables() {
    const [tables, setTables] = useState([]);

    useEffect(() => {
        fetchTables();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchTables();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const fetchTables = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/tables", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        setTables(data.tables || data);
    };

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/tables/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Erreur changement statut");
            return;
        }

        fetchTables();
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {tables.map(table => (
                        <div key={table._id} className="bg-white shadow p-4 rounded border">

                            <h2 className="font-bold text-lg mb-2">
                                Table {table.number}
                            </h2>

                            <p className="text-gray-600 mb-3">
                                Statut :{" "}
                                <span className={getStatusColor(table.status)}>
                                    {table.status}
                                </span>
                            </p>

                            <div className="flex flex-col gap-2">

                                {/* Voir commande si occupée */}
                                {table.status === "occupied" && (
                                    <Link
                                        to={`/waiter/orders/${table._id}`}
                                        className="bg-orange-600 text-white px-3 py-2 rounded text-center"
                                    >
                                        Voir commande
                                    </Link>
                                )}

                                {/* Réserver */}
                                {table.status === "available" && (
                                    <button
                                        onClick={() => updateStatus(table._id, "reserved")}
                                        className="bg-blue-700 text-white px-3 py-2 rounded"
                                    >
                                        Réserver
                                    </button>
                                )}

                                {/* Libérer */}
                                {(table.status === "reserved" || table.status === "occupied") && (
                                    <button
                                        onClick={() => updateStatus(table._id, "available")}
                                        className="bg-gray-700 text-white px-3 py-2 rounded"
                                    >
                                        Libérer la table
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
