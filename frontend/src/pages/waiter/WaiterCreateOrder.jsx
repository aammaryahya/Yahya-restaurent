import { useEffect, useState } from "react";
import WaiterLayout from "../../layouts/WaiterLayout";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";


export default function WaiterCreateOrder() {
    const navigate = useNavigate();

    const [menu, setMenu] = useState([]);
    const [items, setItems] = useState([]);
    const [note, setNote] = useState("");
    const [tables, setTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState("");

    useEffect(() => {
        fetchMenu();
        fetchTables();
    }, []);

    useEffect(() => {
        socket.on("menuUpdated", () => {
            fetchMenu();
        });
        socket.on("tablesUpdated", () => {
            fetchTables();
        });

        return () => {
            socket.off("menuUpdated");
            socket.off("tablesUpdated");
        };
    }, []);

    const fetchMenu = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/menu", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        const availableOnly = data.filter(item => item.available === true);
        setMenu(availableOnly);
    };

    const fetchTables = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/tables", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        const list = data.tables || data;

        // Tables disponibles ou réservées
        const filtered = list.filter(t => t.status === "available" || t.status === "reserved");

        setTables(filtered);
    };

    const addItem = (menuItem) => {
        const exists = items.find(i => i.menuItemId === menuItem._id);

        if (exists) {
            setItems(items.map(i =>
                i.menuItemId === menuItem._id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ));
        } else {
            setItems([...items, { menuItemId: menuItem._id, quantity: 1 }]);
        }
    };

    const removeItem = (menuItem) => {
        const exists = items.find(i => i.menuItemId === menuItem._id);

        if (!exists) return;

        if (exists.quantity === 1) {
            setItems(items.filter(i => i.menuItemId !== menuItem._id));
        } else {
            setItems(items.map(i =>
                i.menuItemId === menuItem._id
                    ? { ...i, quantity: i.quantity - 1 }
                    : i
            ));
        }
    };

    const sendOrder = async () => {
        const token = localStorage.getItem("token");

        if (!selectedTableId) {
            alert("Choisis une table !");
            return;
        }

        if (items.length === 0) {
            alert("Ajoute au moins un item !");
            return;
        }

        const res = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                tableId: selectedTableId,
                items: items.map(i => ({
                    menuItemId: i.menuItemId,
                    quantity: i.quantity
                })),
                notes: note
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Erreur création commande");
            return;
        }

        await fetch(`http://localhost:5000/api/tables/${selectedTableId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: "occupied" })
        });

        navigate("/waiter/orders");
    };

    return (
        <WaiterLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Créer une commande</h1>

                {/* TABLE SELECT */}
                <div className="mb-6">
                    <label className="font-semibold">Sélectionner une table</label>
                    <select
                        className="border p-2 rounded w-full mt-2"
                        value={selectedTableId}
                        onChange={(e) => setSelectedTableId(e.target.value)}
                    >
                        <option value="">-- Choisir une table --</option>
                        {tables.map(t => (
                            <option key={t._id} value={t._id}>
                                Table {t.number} ({t.status})
                            </option>
                        ))}
                    </select>
                </div>

                {/* MENU GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {menu.map(item => (
                        <div key={item._id} className="bg-white shadow p-4 rounded border">

                            <h2 className="font-bold text-lg mb-2">{item.name}</h2>

                            <p className="text-green-600 mb-3">Disponible</p>

                            {/* Quantité */}
                            <div className="flex items-center gap-3 mt-3">
                                <button
                                    onClick={() => removeItem(item)}
                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    -
                                </button>

                                <span className="font-bold">
                                    {items.find(i => i.menuItemId === item._id)?.quantity || 0}
                                </span>

                                <button
                                    onClick={() => addItem(item)}
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* NOTE */}
                <div className="mb-6">
                    <label className="font-semibold">Note pour la cuisine</label>
                    <textarea
                        className="border p-2 rounded w-full mt-2"
                        rows="3"
                        placeholder="Ex: Sans oignons, bien cuit..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                {/* BOUTON ENVOYER */}
                <button
                    onClick={sendOrder}
                    className="bg-blue-600 text-white px-6 py-3 rounded text-lg w-full hover:bg-blue-700"
                >
                    Envoyer à la cuisine
                </button>
            </div>
        </WaiterLayout>
    );
}
