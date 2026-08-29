import { useEffect, useState } from "react";
import WaiterLayout from "../../layouts/WaiterLayout";
import { socket } from "../../socket";


export default function WaiterInventory() {
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        fetchInventory();
    }, []);

    useEffect(() => {
        socket.on("inventoryUpdated", () => {
            fetchInventory();
        });

        return () => {
            socket.off("inventoryUpdated");
        };
    }, []);

    const fetchInventory = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/inventory", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setIngredients(data);
    };

    const adjustStock = async (id, amount) => {
        const token = localStorage.getItem("token");

        const type = amount > 0 ? "in" : "out";
        const quantity = Math.abs(amount);

        await fetch(`http://localhost:5000/api/inventory/${id}/transaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                type,
                quantity,
                note: "Modification par le serveur"
            })
        });

        fetchInventory();
    };

    return (
        <WaiterLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Stock</h1>

                {/* GRID 3 PAR LIGNE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {ingredients.map(i => (
                        <div key={i._id} className="bg-white shadow p-4 rounded border">
                            <h2 className="font-bold">{i.name}</h2>
                            <p>Stock : {i.stock}{i.unit}</p>
                            <p>Minimum : {i.minStock}{i.unit}</p>

                            <div className="mt-3 flex gap-3">
                                <button
                                    onClick={() => adjustStock(i._id, +1)}
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    + Ajouter
                                </button>

                                <button
                                    onClick={() => adjustStock(i._id, -1)}
                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    - Retirer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WaiterLayout>
    );
}
