import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = await login(email, password);

        if (!result.success) {
            setError(result.message);
            return;
        }

        if (result.role === "admin") navigate("/admin");
        if (result.role === "waiter") navigate("/waiter");
        if (result.role === "chef") navigate("/chef");
        if (result.role === "cashier") navigate("/cashier");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>

                {error && (
                    <p className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full p-3 border rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                    Se connecter
                </button>
            </form>
        </div>
    );
}
