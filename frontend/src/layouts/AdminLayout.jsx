import AdminSidebar from "../components/AdminSidebar";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";


export default function AdminLayout({ children }) {
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
            <AdminSidebar />

            <div className="flex-1">
                <div className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">YAKA Restaurant</h1>
                    <Link
                        to="/admin"
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
                            {user?.name || "Admin"} ▼
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

                {showProfileModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                            <h2 className="text-xl font-bold mb-4">Modifier le profil</h2>

                            <input
                                type="text"
                                defaultValue={user?.name}
                                className="border p-2 rounded w-full mb-3"
                                id="profileName"
                            />

                            <input
                                type="email"
                                defaultValue={user?.email}
                                className="border p-2 rounded w-full mb-3 bg-gray-100 text-gray-500"
                                disabled
                            />

                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={async () => {
                                        const name = document.getElementById("profileName").value;
                                        const token = localStorage.getItem("token");

                                        const res = await fetch("http://localhost:5000/api/auth/update-profile", {
                                            method: "PUT",
                                            headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}`
                                            },
                                            body: JSON.stringify({ name })
                                        });

                                        const data = await res.json();

                                        if (!res.ok) return alert(data.message);

                                        localStorage.setItem("user", JSON.stringify(data.user));
                                        setUser(data.user);
                                        setShowProfileModal(false);
                                    }}
                                >
                                    Sauvegarder
                                </button>

                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    onClick={() => setShowProfileModal(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                            <h2 className="text-xl font-bold mb-4">Changer le mot de passe</h2>

                            <input type="password" id="oldPassword" className="border p-2 rounded w-full mb-3" placeholder="Ancien mot de passe" />
                            <input type="password" id="newPassword" className="border p-2 rounded w-full mb-3" placeholder="Nouveau mot de passe" />
                            <input type="password" id="confirmPassword" className="border p-2 rounded w-full mb-3" placeholder="Confirmer le mot de passe" />

                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    onClick={async () => {
                                        const oldPassword = document.getElementById("oldPassword").value;
                                        const newPassword = document.getElementById("newPassword").value;
                                        const confirmPassword = document.getElementById("confirmPassword").value;

                                        if (newPassword !== confirmPassword) return alert("Les mots de passe ne correspondent pas.");

                                        const token = localStorage.getItem("token");

                                        const res = await fetch("http://localhost:5000/api/auth/change-password", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}`
                                            },
                                            body: JSON.stringify({ oldPassword, newPassword })
                                        });

                                        const data = await res.json();

                                        if (!res.ok) return alert(data.message);

                                        alert("Mot de passe changé avec succès");
                                        setShowPasswordModal(false);
                                    }}
                                >
                                    Sauvegarder
                                </button>

                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
