import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiEye,
  FiX,
  FiShoppingBag,
  FiRefreshCw,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const PAGE_SIZE = 8;

const ORDER_STATUSES = ["Pending", "Processing", "Completed", "Shipped", "Canceled"];

const statusStyles = {
  Pending: { badge: "border-amber-400/20 bg-amber-400/10 text-amber-300", icon: FiClock },
  Processing: { badge: "border-sky-400/20 bg-sky-400/10 text-sky-300", icon: FiRefreshCw },
  Completed: { badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300", icon: FiCheckCircle },
  Shipped: { badge: "border-violet-400/20 bg-violet-400/10 text-violet-300", icon: FiTruck },
  Canceled: { badge: "border-red-400/20 bg-red-400/10 text-red-300", icon: FiXCircle },
};

/* ---------- small helpers (they match the backend Order fields) ---------- */
const formatMoney = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  const parsed = new Date(date);
  if (!date || Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("en-LK", { dateStyle: "medium", timeStyle: "short" });
};

const getId = (order) => order?.orderID ?? order?._id ?? "Unknown";
const getItems = (order) => order?.items ?? [];
const getQty = (item) => Number(item?.quantity ?? 1);
const getPrice = (item) => Number(item?.price ?? 0);
const getName = (order) => order?.name || "Customer";
const getTotal = (order) =>
  order?.total != null
    ? Number(order.total)
    : getItems(order).reduce((sum, item) => sum + getPrice(item) * getQty(item), 0);

const normalizeStatus = (status) =>
  ORDER_STATUSES.find(
    (item) => item.toLowerCase() === String(status || "").toLowerCase()
  ) || "Pending";

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status);
  const Icon = statusStyles[normalized].icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[normalized].badge}`}
    >
      <Icon size={13} />
      {normalized}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm text-slate-200">{value || "-"}</p>
    </div>
  );
}

/* ---------- order details popup ---------- */
function OrderModal({ order, onClose, onSave, saving }) {
  const [status, setStatus] = useState(normalizeStatus(order?.status));
  const [notes, setNotes] = useState(order?.notes || "");
  const items = getItems(order);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, saving]);

  const submit = (event) => {
    event.preventDefault();
    onSave({ status, notes: notes.trim() });
  };

  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-[#080d17] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div className="flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0b1120] shadow-2xl sm:max-h-[92vh] sm:rounded-3xl">
        {/* Heading */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.08] px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h2 className="break-all text-lg font-bold text-white sm:text-xl">
              Order #{getId(order)}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Placed {formatDate(order?.createdAt || order?.date)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close order details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
            {/* Customer (read only) */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <FiUser className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Customer</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Info label="Name" value={order?.name} />
                <Info label="Phone" value={order?.phone} />
                <Info label="Email" value={order?.email} />
              </div>
            </section>

            {/* Delivery (read only) */}
            <section className="border-t border-white/[0.07] pt-5">
              <div className="mb-4 flex items-center gap-2">
                <FiMapPin className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Delivery</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Info label="Address" value={order?.address} />
                </div>
                <Info label="Payment method" value={order?.paymentMethod} />
                <Info label="Customer note" value={order?.deliveryNote} />
              </div>
            </section>

            {/* Items */}
            <section className="border-t border-white/[0.07] pt-5">
              <div className="mb-4 flex items-center gap-2">
                <FiShoppingBag className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Ordered products</h3>
              </div>

              {items.length > 0 ? (
                <div className="divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.07]">
                  {items.map((item, index) => (
                    <div
                      key={item?._id || item?.productID || index}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-slate-200">
                          {item?.name || "Product"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatMoney(getPrice(item))} x {getQty(item)}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-white">
                        {formatMoney(getPrice(item) * getQty(item))}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 p-5 text-center text-sm text-slate-500">
                  No products were found for this order.
                </div>
              )}

              <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-4">
                <p className="text-xs text-slate-400">Order total (with delivery)</p>
                <p className="text-xl font-extrabold text-emerald-300">
                  {formatMoney(getTotal(order))}
                </p>
              </div>
            </section>

            {/* Editable part */}
            <section className="border-t border-white/[0.07] pt-5">
              <div className="mb-4 flex items-center gap-2">
                <FiPackage className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Update order</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-400">
                    Status
                  </span>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className={fieldClass}
                  >
                    {ORDER_STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-400">
                    Admin note
                  </span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Optional note about this order..."
                    rows={3}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-3 text-xs leading-5 text-slate-400">
                <FiAlertCircle className="mt-0.5 shrink-0 text-amber-300" />
                <p>Only the status and the admin note can be changed here.</p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-white/[0.08] p-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#07120f] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <FiRefreshCw className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiCheckCircle size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- the page ---------- */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  // BACKEND CALL 1: get all orders  (GET /orders, admin only)
  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (token == null) {
        toast.error("Please log in as admin.");
        return;
      }

      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Could not load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // BACKEND CALL 2: change status and note  (PUT /orders/:orderID, admin only)
  const saveOrder = async ({ status, notes }) => {
    if (!selectedOrder) return;

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const id = getId(selectedOrder);

      await axios.put(
        `${API_URL}/orders/${id}`,
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((current) =>
        current.map((order) =>
          getId(order) === id ? { ...order, status, notes } : order
        )
      );

      toast.success("Order updated successfully.");
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to update order:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Could not save the order.");
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        [getId(order), order?.name, order?.email, order?.phone].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      return (
        matchesSearch &&
        (statusFilter === "All" || normalizeStatus(order.status) === statusFilter)
      );
    });
  }, [orders, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const visibleOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const countStatus = (name) =>
    orders.filter((order) => normalizeStatus(order.status) === name).length;

  const stats = [
    { label: "Total orders", value: orders.length, icon: FiShoppingBag, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Pending", value: countStatus("Pending"), icon: FiClock, color: "text-amber-300", bg: "bg-amber-400/10" },
    { label: "Processing", value: countStatus("Processing"), icon: FiRefreshCw, color: "text-sky-300", bg: "bg-sky-400/10" },
    { label: "Completed", value: countStatus("Completed"), icon: FiCheckCircle, color: "text-emerald-300", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="min-w-0 space-y-6 p-4 text-slate-100 sm:p-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Orders
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            View customer orders and update their status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrders(true)}
          disabled={loading || refreshing}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300 disabled:opacity-50 sm:self-auto"
        >
          <FiRefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh orders
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-400 sm:text-sm">
                  {stat.label}
                </span>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Table panel */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b1120]/80">
        {/* Search and filter */}
        <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="font-bold text-white">All orders</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredOrders.length} matching order
              {filteredOrders.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0">
              <FiSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                size={17}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ID, name, email, phone..."
                aria-label="Search orders"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#080d17] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 sm:w-[280px]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter orders by status"
              className="h-11 rounded-xl border border-white/10 bg-[#080d17] px-3 text-sm text-slate-300 outline-none focus:border-emerald-400/50"
            >
              <option value="All">All statuses</option>
              {ORDER_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
            <p className="text-sm text-slate-400">Loading orders...</p>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-500">
              <FiShoppingBag size={28} />
            </div>
            <h3 className="mt-4 font-bold text-white">No orders found</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {search || statusFilter !== "All"
                ? "Try another search term or status filter."
                : "Orders will appear here when customers place them."}
            </p>

            {(search || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.05]">
                  {visibleOrders.map((order) => (
                    <tr
                      key={getId(order)}
                      className="transition-colors hover:bg-emerald-400/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-white">#{getId(order)}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {getItems(order).length} product
                          {getItems(order).length === 1 ? "" : "s"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[190px] truncate text-sm font-semibold text-slate-200">
                          {getName(order)}
                        </p>
                        <p className="mt-1 max-w-[190px] truncate text-xs text-slate-500">
                          {order.email || "No email"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <FiCalendar className="shrink-0 text-slate-500" />
                          {formatDate(order.createdAt || order.date)}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="text-sm font-bold text-white">
                          {formatMoney(getTotal(order))}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 text-xs font-bold text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-400 hover:text-[#07120f] sm:px-4 sm:text-sm"
                        >
                          <FiEye size={15} />
                          View Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-slate-500">
                Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
                {Math.min(page * PAGE_SIZE, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <FiChevronLeft size={18} />
                </button>

                <span className="min-w-16 text-center text-xs font-semibold text-slate-400">
                  Page {page} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order details popup */}
      {selectedOrder && (
        <OrderModal
          key={String(getId(selectedOrder))}
          order={selectedOrder}
          saving={saving}
          onClose={() => {
            if (!saving) setSelectedOrder(null);
          }}
          onSave={saveOrder}
        />
      )}
    </div>
  );
}