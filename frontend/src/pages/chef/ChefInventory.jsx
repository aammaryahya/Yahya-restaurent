import { useEffect, useState } from "react";
import ChefLayout from "../../layouts/ChefLayout";
import { socket } from "../../socket";


export default function ChefInventory() {
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

        const res = await fetch("https://yahya-restaurent.onrender.com/api/inventory", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setIngredients(data);
    };

    const adjustStock = async (id, amount) => {
        const token = localStorage.getItem("token");

        const type = amount > 0 ? "in" : "out";
        const quantity = Math.abs(amount);

        await fetch(`https://yahya-restaurent.onrender.com/api/inventory/${id}/transaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                type,
                quantity,
                note: "Modification par le chef"
            })
        });

        fetchInventory();
    };

    return (
        <ChefLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Stock critique</h1>

                <div className="bg-white shadow p-4 rounded">
                    {ingredients.map(i => (
                        <div key={i._id} className="border p-4 mb-4 rounded">
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
        </ChefLayout>
    );
}
