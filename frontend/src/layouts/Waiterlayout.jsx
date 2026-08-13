import WaiterSidebar from "../components/WaiterSidebar";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function WaiterLayout({ children }) {
    const [openMenu, setOpenMenu] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const { user, setUser } = useContext(AuthContext);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    useEffect(() => {
        const closeMenu = () => setOpenMenu(false);
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, []);

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <WaiterSidebar />

            <div className="flex-1">
                {/* HEADER */}
                <div className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">YAKA Restaurent</h1>

                    <Link
                        to="/waiter"
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                    >
                        Home
                    </Link>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenu(!openMenu);
                            }}
                            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            {user?.name || "Serveur"} ▼
                        </button>

                        {openMenu && (
                            <div
                                className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded border"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setShowProfileModal(true)}
                                >
                                    Profil
                                </button>

                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setShowPasswordModal(true)}
                                >
                                    Mot de passe
                                </button>

                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                    onClick={logout}
                                >
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* CONTENU */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
