import { useEffect, useState } from "react";
import ChefLayout from "../../layouts/ChefLayout";
import { socket } from "../../socket";


export default function MenuStatus() {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetchMenu();
    }, []);

    useEffect(() => {
        socket.on("menuUpdated", () => {
            fetchMenu();
        });

        return () => {
            socket.off("menuUpdated");
        };
    }, []);

    const fetchMenu = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/menu", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setMenuItems(data);
    };

    const toggleStatus = async (id, available) => {
        const token = localStorage.getItem("token");

        await fetch(`http://localhost:5000/api/menu/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ available: !available })
        });

        fetchMenu();
    };

    return (
        <ChefLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Plats</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {menuItems.map(item => (
                        <div key={item._id} className="bg-white shadow p-4 rounded border">

                            <h2 className="font-bold text-lg mb-2">{item.name}</h2>

                            <p className="mb-2">
                                Statut :{" "}
                                <span className={item.available ? "text-green-600" : "text-red-600"}>
                                    {item.available ? "Disponible" : "Indisponible"}
                                </span>
                            </p>

                            <button
                                onClick={() => toggleStatus(item._id, item.available)}
                                className={`mt-3 px-3 py-1 rounded text-white w-full ${item.available ? "bg-red-600" : "bg-green-600"
                                    }`}
                            >
                                {item.available ? "Marquer indisponible" : "Marquer disponible"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </ChefLayout>
    );
}
