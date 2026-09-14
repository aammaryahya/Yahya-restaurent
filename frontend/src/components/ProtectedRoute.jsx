import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProtectedRoute({ children, requiredRole }) {
    const [isValid, setIsValid] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setIsValid(false);
            return;
        }

        axios.get("https://yahya-restaurent.onrender.com/api/auth/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                const user = res.data;

                // Vérifier le rôle
                if (requiredRole && user.role !== requiredRole) {
                    setIsValid(false);
                    return;
                }

                setIsValid(true);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setIsValid(false);
            });
    }, [token]);

    if (isValid === null) {
        return null; // tu peux mettre un loader si tu veux
    }

    if (!isValid) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
