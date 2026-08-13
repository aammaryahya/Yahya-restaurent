import { useEffect, useState } from "react";
import WaiterLayout from "../../layouts/WaiterLayout";
import { useParams, useNavigate } from "react-router-dom";

export default function WaiterCreateOrder() {
    const { tableId } = useParams();
    const navigate = useNavigate();

    const [menu, setMenu] = useState([]);
    const [items, setItems] = useState([]);
    const [note, setNote] = useState("");

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/menu", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setMenu(data);
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

        await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                tableId,
                items,
                notes: note
            })
        });

        navigate("/waiter/orders");
    };

    return (
        <WaiterLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Créer une commande</h1>

                {/* MENU GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {menu.map(item => (
                        <div key={item._id} className="bg-white shadow p-4 rounded border">

                            <h2 className="font-bold text-lg mb-2">{item.name}</h2>

                            <p className="text-gray-600 mb-3">
                                {item.available ? (
                                    <span className="text-green-600">Disponible</span>
                                ) : (
                                    <span className="text-red-600">Indisponible</span>
                                )}
                            </p>

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
