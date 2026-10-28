
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiUsers,
  FiUserCheck,
  FiShield,
  FiRefreshCw,
  FiTrash2,
  FiMail,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

const API_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

const getUserId = (user) => user?._id ?? user?.userID ?? null;

const getRole = (user) =>
  String(user?.role || "user").trim().toLowerCase();

const getFullName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
  user?.name ||
  "Unnamed user";

const getInitials = (user) =>
  (
    (user?.firstName?.[0] || "") +
    (user?.lastName?.[0] || "")
  ).toUpperCase() ||
  user?.name?.[0]?.toUpperCase() ||
  "U";

const getErrorMessage = (err, fallback) => {
  const status = err.response?.status;

  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  return err.response?.data?.message || fallback;
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load users from the backend.
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!API_URL) {
        throw new Error(
          "VITE_BACKEND_URL is missing from your environment configuration."
        );
      }

      const token = localStorage.getItem("token");

      if (!token?.trim()) {
        setError("Please log in as an administrator.");
        setUsers([]);
        return;
      }

      const response = await axios.get(`${API_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // Accept common API response formats.
      const userList = Array.isArray(data)
        ? data
        : Array.isArray(data?.users)
        ? data.users
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.users)
        ? data.data.users
        : null;

      if (!userList) {
        throw new Error(
          "The server returned an unexpected users response."
        );
      }

      setUsers(userList);
    } catch (err) {
      console.error(
        "Error loading users:",
        err.response?.status,
        err.response?.data || err.message
      );

      setUsers([]);
      setError(
        err.message?.includes("VITE_BACKEND_URL") ||
          err.message?.includes("unexpected users response")
          ? err.message
          : getErrorMessage(err, "Unable to load users. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Search and role filtering.
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const searchableText = [
        getFullName(user),
        user?.email,
        getRole(user),
        getUserId(user),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const role = getRole(user);

      const matchesRole =
        roleFilter === "All" ||
        (roleFilter === "Admins" && role === "admin") ||
        (roleFilter === "Customers" && role !== "admin");

      return searchableText.includes(query) && matchesRole;
    });
  }, [users, search, roleFilter]);

  const adminCount = users.filter(
    (user) => getRole(user) === "admin"
  ).length;

  const customerCount = users.length - adminCount;

  // Delete a user after confirmation.
  const handleDelete = async () => {
    if (!selectedUser || deleting) return;

    const userId = getUserId(selectedUser);

    if (!userId) {
      toast.error("This user has no valid ID.");
      return;
    }

    // Additional UI protection. The backend must enforce this too.
    if (getRole(selectedUser) === "admin") {
      toast.error("Administrator accounts cannot be deleted here.");
      setSelectedUser(null);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token?.trim()) {
      toast.error("Please log in as an administrator.");
      return;
    }

    setDeleting(true);

    try {
      await axios.delete(
        `${API_URL}/users/${encodeURIComponent(String(userId))}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Compare IDs as strings to handle different ID types.
      setUsers((previous) =>
        previous.filter(
          (user) => String(getUserId(user)) !== String(userId)
        )
      );

      setSelectedUser(null);
      toast.success("User deleted successfully.");
    } catch (err) {
      console.error(
        "Error deleting user:",
        err.response?.status,
        err.response?.data || err.message
      );

      toast.error(
        getErrorMessage(err, "Unable to delete this user.")
      );
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All");
  };

  return (
    <div className="min-h-screen bg-[#080d17] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
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
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#101827] px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-emerald-400/50 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
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
                  type="button"
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
                type="button"
                onClick={clearFilters}
                className="text-emerald-400 hover:text-emerald-300"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[#101827]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
            <p className="text-sm text-gray-400">Loading users...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-[#101827] p-8 text-center">
            <FiAlertCircle
              size={30}
              className="mx-auto mb-3 text-red-400"
            />

            <p className="font-semibold">Couldn&apos;t load users</p>

            <p className="mt-2 break-words text-sm text-gray-400">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchUsers}
              className="mt-5 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#080d17] transition hover:bg-emerald-300"
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
                      <th className="px-5 py-4 font-medium">User</th>
                      <th className="px-5 py-4 font-medium">
                        Email address
                      </th>
                      <th className="px-5 py-4 font-medium">Role</th>
                      <th className="px-5 py-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredUsers.map((user, index) => {
                      const isAdmin = getRole(user) === "admin";
                      const userId = getUserId(user);

                      return (
                        <tr
                          key={userId || user.email || index}
                          className="transition hover:bg-white/[0.025]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${
                                  isAdmin
                                    ? "border-purple-400/20 bg-purple-400/10 text-purple-300"
                                    : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                }`}
                              >
                                {getInitials(user)}
                              </div>

                              <div>
                                <p className="font-medium text-gray-100">
                                  {getFullName(user)}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {userId || "No ID"}
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
                              <span>{user.email || "No email"}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                                isAdmin
                                  ? "border-purple-400/20 bg-purple-400/10 text-purple-300"
                                  : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              }`}
                            >
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
                              type="button"
                              onClick={() => setSelectedUser(user)}
                              disabled={isAdmin || !userId}
                              title={
                                isAdmin
                                  ? "Admin accounts cannot be deleted here"
                                  : !userId
                                  ? "This user has no valid ID"
                                  : "Delete user"
                              }
                              aria-label={`Delete ${getFullName(user)}`}
                              className="inline-flex items-center justify-center rounded-lg border border-red-400/10 bg-red-400/[0.06] p-2.5 text-red-400 transition hover:border-red-400/30 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
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
                <FiUsers size={34} className="mb-4 text-gray-600" />

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

      {/* Delete confirmation dialog */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setSelectedUser(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            aria-describedby="delete-user-description"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101827] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                <FiTrash2 size={22} />
              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={() => setSelectedUser(null)}
                aria-label="Close confirmation dialog"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <FiX size={20} />
              </button>
            </div>

            <h2
              id="delete-user-title"
              className="text-xl font-bold"
            >
              Delete user?
            </h2>

            <p
              id="delete-user-description"
              className="mt-3 break-words text-sm leading-6 text-gray-400"
            >
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {getFullName(selectedUser)}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setSelectedUser(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
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
    emerald:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    blue: "border-blue-400/20 bg-blue-400/10 text-blue-400",
    purple:
      "border-purple-400/20 bg-purple-400/10 text-purple-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101827] p-5 transition hover:border-white/20">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
            colors[color] || colors.emerald
          }`}
        >
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
