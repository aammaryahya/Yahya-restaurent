import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { socket } from "../../socket";


export default function Tables() {
    const [tables, setTables] = useState([]);
    const [search, setSearch] = useState("");

    // Ajouter
    const [showAddModal, setShowAddModal] = useState(false);
    const [newNumber, setNewNumber] = useState("");
    const [newSeats, setNewSeats] = useState("");
    const [newStatus, setNewStatus] = useState("available");

    // Modifier
    const [editId, setEditId] = useState(null);
    const [editNumber, setEditNumber] = useState("");
    const [editSeats, setEditSeats] = useState("");
    const [editStatus, setEditStatus] = useState("");

    // Supprimer
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {
        fetchTables();
    }, []);

    useEffect(() => {
        socket.on("tablesUpdated", () => {
            fetchTables();
        });

        return () => {
            socket.off("tablesUpdated");
        };
    }, []);

    const fetchTables = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/tables", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        setTables(data);
    };

    // Ajouter une table
    const addTable = async () => {
        const token = localStorage.getItem("token");

        const exists = tables.some(t => t.number === Number(newNumber));

        if (exists) {
            alert("Ce numéro de table " + newNumber + " existe déjà !");
            return;
        }


        const response = await fetch("http://localhost:5000/api/tables", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                number: newNumber,
                seats: newSeats,
                status: newStatus
            })
        });

        if (response.ok) {
            setShowAddModal(false);
            setNewNumber("");
            setNewSeats("");
            setNewStatus("available");
            fetchTables();
        }
    };

    // Supprimer une table
    const deleteTable = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/tables/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            setConfirmDeleteId(null);
            fetchTables();
        }
    };

    // Ouvrir modal de modification
    const openEditModal = (table) => {
        setEditId(table._id);
        setEditNumber(table.number);
        setEditSeats(table.seats);
        setEditStatus(table.status);
    };

    // Modifier une table
    const updateTable = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/tables/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                number: editNumber,
                seats: editSeats,
                status: editStatus
            })
        });

        if (response.ok) {
            setEditId(null);
            fetchTables();
        }
    };

    // Recherche
    const filteredTables = tables.filter((t) => {
        const q = search.toLowerCase().trim();
        if (!q) return true;

        return (
            t.number.toString().includes(q) ||
            t.seats.toString().includes(q) ||
            t.status.toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout>
            <div className="p-6">

                <h1 className="text-2xl font-bold mb-4">Tables</h1>

                {/* Recherche */}
                <input
                    type="text"
                    placeholder="Rechercher une table..."
                    className="border p-2 rounded w-full mb-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Bouton ajouter */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Ajouter une table
                </button>

                {/* Tableau */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-2 border">Numéro</th>
                            <th className="p-2 border">Places</th>
                            <th className="p-2 border">Statut</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTables.map((t) => (
                            <tr key={t._id} className="border">
                                <td className="p-2 border">{t.number}</td>
                                <td className="p-2 border">{t.seats}</td>
                                <td className="p-2 border">{t.status}</td>

                                <td className="p-2 border">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                        onClick={() => openEditModal(t)}
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => setConfirmDeleteId(t._id)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-scaleIn">
                        <h2 className="text-xl font-bold mb-4">Ajouter une table</h2>

                        <input className="border p-2 rounded w-full mb-3"
                            placeholder="Table Numero"
                            value={newNumber}
                            onChange={(e) => setNewNumber(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            placeholder="Nombre de places"
                            value={newSeats}
                            onChange={(e) => setNewSeats(e.target.value)}
                        />

                        <select className="border p-2 rounded w-full mb-3"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="available">available</option>
                            <option value="occupied">occupied</option>
                            <option value="reserved">reserved</option>
                        </select>

                        <div className="flex justify-between">
                            <button
                                onClick={addTable}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Ajouter
                            </button>

                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Modifier */}
            {editId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-scaleIn">
                        <h2 className="text-xl font-bold mb-4">Modifier la table</h2>

                        <input className="border p-2 rounded w-full mb-3"
                            value={editNumber}
                            onChange={(e) => setEditNumber(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            value={editSeats}
                            onChange={(e) => setEditSeats(e.target.value)}
                        />

                        <select className="border p-2 rounded w-full mb-3"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                        >
                            <option value="available">available</option>
                            <option value="occupied">occupied</option>
                            <option value="reserved">reserved</option>
                        </select>

                        <div className="flex justify-between">
                            <button
                                onClick={updateTable}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Sauvegarder
                            </button>

                            <button
                                onClick={() => setEditId(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation suppression */}
            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80 animate-scaleIn">
                        <h2 className="text-xl font-bold mb-4">Supprimer ?</h2>
                        <p className="mb-4">Voulez-vous vraiment supprimer cette table ?</p>

                        <div className="flex justify-between">
                            <button
                                onClick={() => deleteTable(confirmDeleteId)}
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
