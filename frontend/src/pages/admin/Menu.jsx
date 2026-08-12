import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function MenuItems() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");

    // Ajouter
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newAvailable, setNewAvailable] = useState(true);

    // Modifier
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editAvailable, setEditAvailable] = useState(true);

    // Supprimer
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/menu", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        setItems(data);
    };

    // Ajouter un item
    const addItem = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/menu", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: newName,
                category: newCategory,
                price: newPrice,
                description: newDescription,
                available: newAvailable
            })
        });

        if (response.ok) {
            setShowAddModal(false);
            setNewName("");
            setNewCategory("");
            setNewPrice("");
            setNewDescription("");
            setNewAvailable(true);
            fetchItems();
        }
    };

    // Supprimer un item
    const deleteItem = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            setConfirmDeleteId(null);
            fetchItems();
        }
    };

    // Ouvrir modal de modification
    const openEditModal = (item) => {
        setEditId(item._id);
        setEditName(item.name);
        setEditCategory(item.category);
        setEditPrice(item.price);
        setEditDescription(item.description);
        setEditAvailable(item.available);
    };

    // Modifier un item
    const updateItem = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/menu/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: editName,
                category: editCategory,
                price: editPrice,
                description: editDescription,
                available: editAvailable
            })
        });

        if (response.ok) {
            setEditId(null);
            fetchItems();
        }
    };

    // Recherche + filtre
    const filteredItems = items.filter((item) => {
        const q = search.toLowerCase().trim();

        const matchesSearch =
            item.name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q);

        const matchesCategory =
            categoryFilter === "" || item.category === categoryFilter;

        const matchesAvailability =
            availabilityFilter === "" ||
            String(item.available) === availabilityFilter;

        return matchesSearch && matchesCategory && matchesAvailability;
    });

    return (
        <AdminLayout>
            <div className="p-6">

                <h1 className="text-2xl font-bold mb-4">Menu Items</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Ajouter un item
                </button>

                {/* Recherche */}
                <input
                    type="text"
                    placeholder="Rechercher un item..."
                    className="border p-2 rounded w-full mb-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Filtre catégorie */}
                <select
                    className="border p-2 rounded mb-4"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Toutes les catégories</option>
                    {[...new Set(items.map(i => i.category))].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <select
                    className="border p-2 rounded mb-4 ml-2"
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                    <option value="">Disponibilité (tous)</option>
                    <option value="true">Disponible</option>
                    <option value="false">Indisponible</option>
                </select>


                {/* Tableau */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-2 border">Nom</th>
                            <th className="p-2 border">Catégorie</th>
                            <th className="p-2 border">Prix</th>
                            <th className="p-2 border">Disponible</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item._id} className="border">
                                <td className="p-2 border">{item.name}</td>
                                <td className="p-2 border">{item.category}</td>
                                <td className="p-2 border">{item.price} $</td>

                                <td className="p-2 border">
                                    <span
                                        className={
                                            item.available
                                                ? "text-green-600 font-semibold"
                                                : "text-red-600 font-semibold"
                                        }
                                    >
                                        {item.available ? "Disponible" : "Indisponible"}
                                    </span>
                                </td>

                                <td className="p-2 border">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                        onClick={() => openEditModal(item)}
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => setConfirmDeleteId(item._id)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            {/* Modal Ajouter */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Ajouter un item</h2>

                        <input className="border p-2 rounded w-full mb-3"
                            placeholder="Nom"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            placeholder="Catégorie"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            placeholder="Prix"
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                        />

                        <textarea className="border p-2 rounded w-full mb-3"
                            placeholder="Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />

                        <label className="flex items-center mb-3">
                            <input
                                type="checkbox"
                                checked={newAvailable}
                                onChange={(e) => setNewAvailable(e.target.checked)}
                                className="mr-2"
                            />
                            Disponible
                        </label>

                        <div className="flex justify-between">
                            <button
                                onClick={addItem}
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
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Modifier l’item</h2>

                        <input className="border p-2 rounded w-full mb-3"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                        />

                        <textarea className="border p-2 rounded w-full mb-3"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />

                        <label className="flex items-center mb-3">
                            <input
                                type="checkbox"
                                checked={editAvailable}
                                onChange={(e) => setEditAvailable(e.target.checked)}
                                className="mr-2"
                            />
                            Disponible
                        </label>

                        <div className="flex justify-between">
                            <button
                                onClick={updateItem}
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
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80">
                        <h2 className="text-xl font-bold mb-4">Supprimer ?</h2>
                        <p className="mb-4">Voulez-vous vraiment supprimer cet item ?</p>

                        <div className="flex justify-between">
                            <button
                                onClick={() => deleteItem(confirmDeleteId)}
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