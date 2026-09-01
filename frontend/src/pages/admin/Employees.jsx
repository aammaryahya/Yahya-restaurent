import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");

    // Ajouter
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState("waiter");

    // Modifier
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState("");

    // Supprimer
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordId, setPasswordId] = useState(null);
    const [newPasswordAdmin, setNewPasswordAdmin] = useState("");

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchEmployees();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const fetchEmployees = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("https://yahya-restaurent.onrender.com/api/employees", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        setEmployees(data);
    };

    // Ajouter un employé
    const addEmployee = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("https://yahya-restaurent.onrender.com/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: newName,
                email: newEmail,
                password: newPassword,
                role: newRole
            })
        });

        if (response.ok) {
            setShowAddModal(false);
            setNewName("");
            setNewEmail("");
            setNewPassword("");
            setNewRole("waiter");
            fetchEmployees();
        }
    };

    // Supprimer un employé
    const deleteEmployee = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`https://yahya-restaurent.onrender.com/api/auth/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            setConfirmDeleteId(null);
            fetchEmployees();
        }
    };

    // Ouvrir modal de modification
    const openEditModal = (emp) => {
        setEditId(emp._id);
        setEditName(emp.name);
        setEditEmail(emp.email);
        setEditRole(emp.role);
    };

    const openPasswordModal = (emp) => {
        setPasswordId(emp._id);
        setNewPasswordAdmin("");
        setShowPasswordModal(true);
    };

    // Modifier un employé
    const updateEmployee = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(`https://yahya-restaurent.onrender.com/api/employees/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: editName,
                email: editEmail,
                role: editRole
            })
        });

        if (response.ok) {
            setEditId(null);
            fetchEmployees();
        }
    };
    const updatePassword = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(`https://yahya-restaurent.onrender.com/api/employees/${passwordId}/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ newPassword: newPasswordAdmin })
        });

        if (response.ok) {
            setShowPasswordModal(false);
            setPasswordId(null);
            setNewPasswordAdmin("");
            fetchEmployees();
        }
    };


    const FilteredEmployees = employees.filter((emp) => {
        const query = search.toLowerCase().trim();
        if (!query) return true;

        return (
            emp.name.toLowerCase().includes(query) || 
            emp.email.toLowerCase().includes(query) ||
            emp.role.toLowerCase().includes(query)
        )
    })

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6">Gestion des employés</h1>

            {/* Bouton Ajouter */}
            <button
                onClick={() => setShowAddModal(true)}
                className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                + Ajouter un employé
            </button>

            <input
                type="text"
                placeholder="Rechercher par nom, email ou rôle..."
                className="border p-2 rounded w-full mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3">Nom</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Rôle</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {FilteredEmployees.map((emp) => (
                            <tr key={emp._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-3">{emp.name}</td>
                                <td className="p-3">{emp.email}</td>
                                <td className="p-3">{emp.role}</td>

                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => openEditModal(emp)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        onClick={() => openPasswordModal(emp)}
                                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                                    >
                                        Mot de passe
                                    </button>

                                    <button
                                        onClick={() => setConfirmDeleteId(emp._id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Ajouter */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-scaleIn">
                        <h2 className="text-xl font-bold mb-4">Ajouter un employé</h2>

                        <input className="border p-2 rounded w-full mb-3"
                            placeholder="Nom"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            placeholder="Email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            placeholder="Mot de passe"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <select className="border p-2 rounded w-full mb-3"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="waiter">Serveur</option>
                            <option value="chef">Chef</option>
                            <option value="cashier">Caissier</option>
                        </select>

                        <div className="flex justify-between">
                            <button
                                onClick={addEmployee}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Ajouter
                            </button>

                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal chnager MDP */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-scaleIn">
                        <h2 className="text-xl font-bold mb-4">Changer le mot de passe</h2>

                        <input
                            type="password"
                            className="border p-2 rounded w-full mb-3"
                            placeholder="Nouveau mot de passe"
                            value={newPasswordAdmin}
                            onChange={(e) => setNewPasswordAdmin(e.target.value)}
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={updatePassword}
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                            >
                                Sauvegarder
                            </button>

                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal Modifier */}
            {editId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-scaleIn">
                        <h2 className="text-xl font-bold mb-4">Modifier l’employé</h2>

                        <input className="border p-2 rounded w-full mb-3"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />

                        <input className="border p-2 rounded w-full mb-3"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                        />

                        <select className="border p-2 rounded w-full mb-3"
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="waiter">Serveur</option>
                            <option value="chef">Chef</option>
                            <option value="cashier">Caissier</option>
                        </select>

                        <div className="flex justify-between">
                            <button
                                onClick={updateEmployee}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Sauvegarder
                            </button>

                            <button
                                onClick={() => setEditId(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation suppression */}
            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80 animate-scaleIn">
                        <h2 className="text-xl font-bold mb-4">Supprimer ?</h2>
                        <p className="mb-4">Voulez-vous vraiment supprimer cet employé ?</p>

                        <div className="flex justify-between">
                            <button
                                onClick={() => deleteEmployee(confirmDeleteId)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Oui, supprimer
                            </button>

                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
