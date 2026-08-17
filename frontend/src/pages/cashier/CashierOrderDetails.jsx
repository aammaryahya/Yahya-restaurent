import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CashierLayout from "../../layouts/CashierLayout";

export default function CashierOrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrder(); 
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const fetchOrder = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setOrder(data.order || data);
    };

    if (!order) {
        return (
            <CashierLayout>
                <div className="p-6">Chargement...</div>
            </CashierLayout>
        );
    }

    return (
        <CashierLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Détails de la commande</h1>

                <div className="bg-white shadow p-4 rounded border">
                    <h2 className="font-bold text-lg mb-2">
                        Table {order.tableId?.number}
                    </h2>

                    <p className="text-gray-600 mb-3">
                        Statut : {order.status}
                    </p>

                    <h3 className="font-semibold mb-2">Items :</h3>
                    <ul className="list-disc ml-5 text-gray-700 mb-4">
                        {order.items.map((item, index) => (
                            <li key={index}>
                                {item.menuItemId?.name} × {item.quantity}
                            </li>
                        ))}
                    </ul>

                    <p className="font-bold text-lg mb-4">
                        Total : {order.total || "N/A"} $
                    </p>

                    <Link
                        to="/cashier/orders"
                        className="bg-gray-700 text-white px-3 py-2 rounded block text-center"
                    >
                        Retour aux commandes
                    </Link>
                </div>
            </div>
        </CashierLayout>
    );
}
