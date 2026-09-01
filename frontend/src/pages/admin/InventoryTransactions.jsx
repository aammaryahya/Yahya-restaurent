import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { socket } from "../../socket";

export default function InventoryTransactions() {
    const [ingredients, setIngredients] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState("");
    const [userFilter, setUserFilter] = useState("");


    useEffect(() => {
        fetchIngredients();
        fetchAdjustments();
    }, []);

    useEffect(() => {
        if (selectedIngredient === "") {
            fetchAdjustments();
        } else {
            fetchAdjustmentsByIngredient(selectedIngredient);
        }
    }, [selectedIngredient]);

    useEffect(() => {
        socket.on("inventoryUpdated", () => {
            if (selectedIngredient === "") {
                fetchAdjustments();
            } else {
                fetchAdjustmentsByIngredient(selectedIngredient);
            }
        });

        return () => socket.off("inventoryUpdated");
    }, [selectedIngredient]);

    const fetchIngredients = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("https://yahya-restaurent.onrender.com/api/inventory", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();

        if (Array.isArray(data)) {
            setIngredients(data);
        } else {
            setIngredients([]);
        }
    };

    const fetchAdjustments = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("https://yahya-restaurent.onrender.com/api/inventory/adjustments", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();

        if (Array.isArray(data)) {
            const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAdjustments(sorted);
        } else {
            setAdjustments([]);
        }

    };

    const fetchAdjustmentsByIngredient = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`https://yahya-restaurent.onrender.com/api/inventory/adjustments/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();

        if (Array.isArray(data)) {
            const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAdjustments(sorted);
        } else {
            setAdjustments([]);
        }

    };

    const filteredAdjustments = adjustments.filter(adj =>
        adj.user?.toLowerCase().includes(userFilter.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">📜 Transactions de stock</h1>

                {/* Filtre */}
                <div className="mb-6">
                    <label className="font-semibold mr-3">Filtrer par ingrédient :</label>
                    <select
                        className="p-2 border rounded"
                        value={selectedIngredient}
                        onChange={(e) => setSelectedIngredient(e.target.value)}
                    >
                        <option value="">Tous les ingrédients</option>

                        {Array.isArray(ingredients) &&
                            ingredients.map((ing) => (
                                <option key={ing._id} value={ing._id}>
                                    {ing.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="font-semibold mr-3">Filtrer par utilisateur :</label>
                    <input
                        type="text"
                        className="p-2 border rounded"
                        placeholder="Nom..."
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                    />
                </div>


                {/* Tableau */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-3 border">Ingrédient</th>
                            <th className="p-3 border">Quantité</th>
                            <th className="p-3 border">Note</th>
                            <th className="p-3 border">Date</th>
                            <th className="p-3 border">Par</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdjustments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-4">
                                    Aucun ajustement trouvé.
                                </td>
                            </tr>
                        ) : (
                            filteredAdjustments.map((adj, index) => (
                                <tr key={index} className="hover:bg-gray-100">

                                    <td className="p-3 border">{adj.ingredientName}</td>

                                    <td className="p-3 border">
                                        {adj.difference > 0
                                            ? `+${adj.difference}`
                                            : adj.difference < 0
                                                ? `-${Math.abs(adj.difference)}`
                                                : "0"}
                                    </td>


                                    <td className="p-3 border">{adj.note || "-"}</td>

                                    <td className="p-3 border">
                                        {new Date(adj.date).toLocaleString()}
                                    </td>

                                    <td className="p-3 border">{adj.user || "Inconnu"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </AdminLayout>
    );
}
