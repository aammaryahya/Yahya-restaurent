import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, requiredRole }) {
    const { user } = useContext(AuthContext);

    // Pas connecté → login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Mauvais rôle → login
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
