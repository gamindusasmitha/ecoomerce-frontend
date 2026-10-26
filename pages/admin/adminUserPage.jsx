
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    FiSearch,
    FiUsers,
    FiUserCheck,
    FiShield,
    FiRefreshCw,
    FiTrash2,
    FiX,
    FiMail,
    FiAlertCircle,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `${API_URL}/users`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = response.data;

        const userList = Array.isArray(data)
            ? data
            : Array.isArray(data.users)
            ? data.users
            : [];

        setUsers(userList);
    } catch (err) {
        console.error(
            "Error loading users:",
            err.response?.status,
            err.response?.data || err.message
        );

        setError(
            err.response?.status === 401
                ? "Authentication failed. Please log in again."
                : "Unable to load users. Please try again."
        );
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchUsers();
    }, []);

    const getRole = (user) => user.role || "user";

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return users.filter((user) => {
            const fullName = [
                user.firstName,
                user.lastName,
            ].filter(Boolean).join(" ");

            const searchableText = [
                fullName,
                user.firstName,
                user.lastName,
                user.email,
                user.role,
                user._id,
                user.userID,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = searchableText.includes(query);
            const role = getRole(user).toLowerCase();

            const matchesRole =
                roleFilter === "All" ||
                (roleFilter === "Admins" && role === "admin") ||
                (roleFilter === "Customers" && role !== "admin");

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    const adminCount = users.filter(
        (user) => getRole(user).toLowerCase() === "admin"
    ).length;

    const customerCount = users.length - adminCount;

    const handleDelete = async () => {
        if (!selectedUser) return;

        const userId = selectedUser._id || selectedUser.userID;

        if (!userId) {
            toast.error("This user has no valid ID.");
            return;
        }

        setDeleting(true);

        try {
            // Assumes your backend supports DELETE /users/:id.
            await axios.delete(
                `${API_URL}/users/${encodeURIComponent(userId)}`
            );

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (user) =>
                        (user._id || user.userID) !== userId
                )
            );

            setSelectedUser(null);
            toast.success("User deleted successfully.");
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error(
                err.response?.data?.message ||
                "Unable to delete this user."
            );
        } finally {
            setDeleting(false);
        }
    };

    const getInitials = (user) => {
        const first = user.firstName?.[0] || "";
        const last = user.lastName?.[0] || "";

        return (first + last).toUpperCase() || "U";
    };

    const getFullName = (user) => {
        const name = [
            user.firstName,
            user.lastName,
        ].filter(Boolean).join(" ");

        return name || "Unnamed user";
    };

    return (
        <div className="min-h-screen bg-[#080d17] p-4 text-white sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                            Administration
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Users
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Manage customer accounts and administrator access.
                        </p>
                    </div>

                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#101827] px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-emerald-400/50 hover:text-emerald-400 disabled:opacity-50"
                    >
                        <FiRefreshCw
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Statistics */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        title="Total Users"
                        value={users.length}
                        icon={<FiUsers size={22} />}
                        color="emerald"
                    />

                    <StatCard
                        title="Customers"
                        value={customerCount}
                        icon={<FiUserCheck size={22} />}
                        color="blue"
                    />

                    <StatCard
                        title="Administrators"
                        value={adminCount}
                        icon={<FiShield size={22} />}
                        color="purple"
                    />
                </div>

                {/* Search and filters */}
                <div className="mb-6 rounded-2xl border border-white/10 bg-[#101827] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <FiSearch
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                size={19}
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, role or ID..."
                                aria-label="Search users"
                                className="w-full rounded-xl border border-white/10 bg-[#080d17] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {["All", "Customers", "Admins"].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    aria-pressed={roleFilter === role}
                                    className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                                        roleFilter === role
                                            ? "bg-emerald-400 text-[#080d17]"
                                            : "border border-white/10 bg-[#080d17] text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                        <span>
                            Showing {filteredUsers.length} of {users.length} users
                        </span>

                        {(search || roleFilter !== "All") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setRoleFilter("All");
                                }}
                                className="text-emerald-400 hover:text-emerald-300"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[#101827]">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
                        <p className="text-sm text-gray-400">
                            Loading users...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-400/20 bg-[#101827] p-8 text-center">
                        <FiAlertCircle
                            size={30}
                            className="mx-auto mb-3 text-red-400"
                        />

                        <p className="font-semibold">Couldn't load users</p>
                        <p className="mt-2 text-sm text-gray-400">{error}</p>

                        <button
                            onClick={fetchUsers}
                            className="mt-5 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#080d17] hover:bg-emerald-300"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Users table */}
                {!loading && !error && (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101827]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
                            <div>
                                <h2 className="font-semibold">All users</h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Account information and access roles
                                </p>
                            </div>

                            <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400">
                                {filteredUsers.length} records
                            </span>
                        </div>

                        {filteredUsers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] text-left">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-gray-500">
                                            <th className="px-5 py-4 font-medium">
                                                User
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Email address
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Role
                                            </th>
                                            <th className="px-5 py-4 text-right font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/[0.06]">
                                        {filteredUsers.map((user, index) => {
                                            const isAdmin =
                                                getRole(user).toLowerCase() ===
                                                "admin";

                                            return (
                                                <tr
                                                    key={
                                                        user._id ||
                                                        user.userID ||
                                                        user.email ||
                                                        index
                                                    }
                                                    className="transition hover:bg-white/[0.025]"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${
                                                                isAdmin
                                                                    ? "border-purple-400/20 bg-purple-400/10 text-purple-300"
                                                                    : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                                            }`}>
                                                                {getInitials(user)}
                                                            </div>

                                                            <div>
                                                                <p className="font-medium text-gray-100">
                                                                    {getFullName(user)}
                                                                </p>

                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    {user.userID ||
                                                                        user._id ||
                                                                        "No ID"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                                            <FiMail
                                                                className="shrink-0 text-gray-500"
                                                                size={15}
                                                            />
                                                            <span>
                                                                {user.email || "No email"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                                                            isAdmin
                                                                ? "border-purple-400/20 bg-purple-400/10 text-purple-300"
                                                                : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                                        }`}>
                                                            {isAdmin ? (
                                                                <FiShield size={13} />
                                                            ) : (
                                                                <FiUserCheck size={13} />
                                                            )}
                                                            {isAdmin ? "Admin" : "Customer"}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-right">
                                                        <button
                                                            onClick={() =>
                                                                setSelectedUser(user)
                                                            }
                                                            title="Delete user"
                                                            aria-label={`Delete ${getFullName(user)}`}
                                                            className="inline-flex items-center justify-center rounded-lg border border-red-400/10 bg-red-400/[0.06] p-2.5 text-red-400 transition hover:border-red-400/30 hover:bg-red-400/10"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                                <FiUsers
                                    size={34}
                                    className="mb-4 text-gray-600"
                                />
                                <h3 className="font-semibold text-white">
                                    No users found
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Try another search term or change the role filter.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete confirmation modal */}
            {selectedUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() => {
                        if (!deleting) setSelectedUser(null);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-user-title"
                        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101827] p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                            <FiTrash2 size={22} />
                        </div>

                        <h2
                            id="delete-user-title"
                            className="text-xl font-bold"
                        >
                            Delete user?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-white">
                                {getFullName(selectedUser)}
                            </span>
                            ? This action may not be reversible.
                        </p>

                        <div className="mt-7 flex gap-3">
                            <button
                                disabled={deleting}
                                onClick={() => setSelectedUser(null)}
                                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={deleting}
                                onClick={handleDelete}
                                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete user"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    const colors = {
        emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
        blue: "border-blue-400/20 bg-blue-400/10 text-blue-400",
        purple: "border-purple-400/20 bg-purple-400/10 text-purple-400",
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-[#101827] p-5 transition hover:border-white/20">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{title}</p>

                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colors[color]}`}>
                    {icon}
                </div>
            </div>

            <p className="mt-5 text-3xl font-bold tracking-tight">
                {value}
            </p>

            <p className="mt-1 text-xs text-gray-500">
                Registered accounts
            </p>
        </div>
    );
}
