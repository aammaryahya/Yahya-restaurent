import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, role }) {
    const { user } = useContext(AuthContext);

    // Pas connecté → redirection vers login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si un rôle est demandé → vérifier
    if (role && user.role !== role) {
        return <Navigate to="/login" replace />;
    }
    console.log("User role:", user.role, "Required role:", role);
    // Sinon → accès autorisé
    return children;
}
