import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function Inventory() {
    const [ingredients, setIngredients] = useState([]);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [transactionType, setTransactionType] = useState("in");
    const [transactionQuantity, setTransactionQuantity] = useState(0);
    const [transactionNote, setTransactionNote] = useState("");

    // Add ingredient fields
    const [newName, setNewName] = useState("");
    const [newUnit, setNewUnit] = useState("");
    const [newStock, setNewStock] = useState(0);
    const [newMinStock, setNewMinStock] = useState(0);

    // Edit ingredient fields
    const [editName, setEditName] = useState("");
    const [editUnit, setEditUnit] = useState("");
    const [editMinStock, setEditMinStock] = useState(0);

    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [lowStockFilter, setLowStockFilter] = useState("");


    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/inventory", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        setIngredients(data);
    };

    const addIngredient = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/inventory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: newName,
                unit: newUnit,
                stock: newStock,
                minStock: newMinStock
            })
        });

        if (response.ok) {
            setShowAddModal(false);
            setNewName("");
            setNewUnit("");
            setNewStock(0);
            setNewMinStock(0);
            fetchIngredients();
        }
    };

    const updateIngredient = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/inventory/${selectedIngredient._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: editName,
                unit: editUnit,
                minStock: editMinStock
            })
        });

        if (response.ok) {
            setShowEditModal(false);
            fetchIngredients();
        }
    };

    const deleteIngredient = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            setConfirmDeleteId(null);
            fetchIngredients();
        }
    };

    const addTransaction = async () => {
        const token = localStorage.getItem("token");

        // Vérification frontend pour éviter stock négatif
        if (transactionType === "out" && transactionQuantity > selectedIngredient.stock) {
            alert("Impossible de retirer plus que le stock actuel !");
            return;
        }

        if (transactionType === "adjust" && transactionQuantity < 0) {
            alert("La quantité ajustée ne peut pas être négative !");
            return;
        }

        const response = await fetch(`http://localhost:5000/api/inventory/${selectedIngredient._id}/transaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                type: transactionType,
                quantity: transactionQuantity,
                note: transactionNote
            })
        });

        if (response.ok) {
            setShowTransactionModal(false);
            setTransactionQuantity(0);
            setTransactionNote("");
            fetchIngredients();
        }
    };

    const filteredIngredients = ingredients.filter((ing) => {
        const q = search.toLowerCase().trim();

        const matchesSearch = ing.name.toLowerCase().includes(q);

        const matchesLowStock =
            lowStockFilter === "" ||
            (lowStockFilter === "low" && ing.stock < ing.minStock) ||
            (lowStockFilter === "normal" && ing.stock >= ing.minStock);

        return matchesSearch && matchesLowStock;
    });


    return (
        <AdminLayout>
            <div className="p-6">

                <h1 className="text-2xl font-bold mb-4">Inventaire</h1>

                {/* Recherche */}
                <input
                    type="text"
                    placeholder="Rechercher un ingrédient..."
                    className="border p-2 rounded w-full mb-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border p-2 rounded mb-4 ml-2"
                    value={lowStockFilter}
                    onChange={(e) => setLowStockFilter(e.target.value)}
                >
                    <option value="">Tous</option>
                    <option value="low">Stock bas</option>
                    <option value="normal">Stock normal</option>
                </select>


                {/* Tableau */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-2 border">Nom</th>
                            <th className="p-2 border">Stock</th>
                            <th className="p-2 border">Unité</th>
                            <th className="p-2 border">Stock minimum</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredIngredients.map((ing) => (
                            <tr key={ing._id} className="border">
                                <td className="p-2 border">{ing.name}</td>

                                <td className="p-2 border">
                                    {ing.stock}

                                    {ing.stock < ing.minStock && (
                                        <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
                                            Stock bas
                                        </span>
                                    )}
                                </td>

                                <td className="p-2 border">{ing.unit}</td>
                                <td className="p-2 border">{ing.minStock}</td>

                                <td className="p-2 border">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                        onClick={() => {
                                            setSelectedIngredient(ing);
                                            setEditName(ing.name);
                                            setEditUnit(ing.unit);
                                            setEditMinStock(ing.minStock);
                                            setShowEditModal(true);
                                        }}
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                                        onClick={() => {
                                            setSelectedIngredient(ing);
                                            setTransactionType("in");
                                            setTransactionQuantity(0);
                                            setTransactionNote("");
                                            setShowTransactionModal(true);
                                        }}
                                    >
                                        Transaction
                                    </button>

                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => setConfirmDeleteId(ing._id)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Bouton ajouter */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Ajouter un ingrédient
                </button>
            </div>

            {/* Modal Ajouter */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Ajouter un ingrédient</h2>

                        <input className="border p-2 rounded w-full mb-3"
                            placeholder="Nom"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            placeholder="Unité (kg, L, pcs...)"
                            value={newUnit}
                            onChange={(e) => setNewUnit(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            type="number"
                            placeholder="Stock initial"
                            value={newStock}
                            onChange={(e) => setNewStock(Number(e.target.value))}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            type="number"
                            placeholder="Stock minimum"
                            value={newMinStock}
                            onChange={(e) => setNewMinStock(Number(e.target.value))}
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={addIngredient}
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
            {showEditModal && selectedIngredient && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Modifier l’ingrédient</h2>

                        <input className="border p-2 rounded w-full mb-3"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            value={editUnit}
                            onChange={(e) => setEditUnit(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            type="number"
                            value={editMinStock}
                            onChange={(e) => setEditMinStock(Number(e.target.value))}
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={updateIngredient}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Sauvegarder
                            </button>

                            <button
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Transaction */}
            {showTransactionModal && selectedIngredient && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Transaction</h2>

                        <select
                            className="border p-2 rounded w-full mb-3"
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                        >
                            <option value="in">Entrée (+)</option>
                            <option value="out">Sortie (-)</option>
                            <option value="adjust">Ajuster (=)</option>
                        </select>

                        <input className="border p-2 rounded w-full mb-3"
                            type="number"
                            placeholder="Quantité"
                            value={transactionQuantity}
                            onChange={(e) => setTransactionQuantity(Number(e.target.value))}
                        />

                        <textarea className="border p-2 rounded w-full mb-3"
                            placeholder="Note"
                            value={transactionNote}
                            onChange={(e) => setTransactionNote(e.target.value)}
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={addTransaction}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Valider
                            </button>

                            <button
                                onClick={() => setShowTransactionModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Supprimer */}
            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80">
                        <h2 className="text-xl font-bold mb-4">Supprimer ?</h2>
                        <p className="mb-4">Voulez-vous vraiment supprimer cet ingrédient ?</p>

                        <div className="flex justify-between">
                            <button
                                onClick={() => deleteIngredient(confirmDeleteId)}
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
