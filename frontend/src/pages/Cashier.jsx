import { useEffect, useState } from "react";
import CashierLayout from "../layouts/CashierLayout";
import { socket } from "../socket";

export default function Cashier() {

    const [stats, setStats] = useState({
        sales: 0,
        paidOrders: 0,
        pendingOrders: 0
    });

    const fetchData = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/cashier/stats", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setStats(data);
    };

    useEffect(() => {
        socket.on("paymentsUpdated", () => {
            fetchData();
        });

        return () => {
            socket.off("paymentsUpdated");
        };
    }, []);


    return (
        <CashierLayout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Dashboard Caissier</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white shadow p-4 rounded border">
                        <h2 className="text-xl font-bold">Ventes du jour</h2>
                        <p className="text-2xl font-semibold text-green-600 mt-2">
                            ${stats.sales}
                        </p>
                    </div>

                    <div className="bg-white shadow p-4 rounded border">
                        <h2 className="text-xl font-bold">Commandes payées</h2>
                        <p className="text-2xl font-semibold text-blue-600 mt-2">
                            {stats.paidOrders}
                        </p>
                    </div>

                    <div className="bg-white shadow p-4 rounded border">
                        <h2 className="text-xl font-bold">En attente de paiement</h2>
                        <p className="text-2xl font-semibold text-red-600 mt-2">
                            {stats.pendingOrders}
                        </p>
                    </div>

                </div>
            </div>
        </CashierLayout>
    );
}
