
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
  FiCreditCard,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiAlertCircle,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Completed",
  "Shipped",
  "Canceled",
];

const statusStyles = {
  Pending: {
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    icon: FiClock,
  },
  Processing: {
    badge: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    icon: FiRefreshCw,
  },
  Completed: {
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    icon: FiCheckCircle,
  },
  Shipped: {
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    icon: FiTruck,
  },
  Canceled: {
    badge: "border-red-400/20 bg-red-400/10 text-red-300",
    icon: FiXCircle,
  },
};

const formatMoney = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getOrderId = (order) =>
  order?.orderID ??
  order?.orderId ??
  order?._id ??
  order?.id ??
  "Unknown";

const getCustomer = (order) =>
  order?.customer ??
  order?.user ??
  order?.customerDetails ??
  {};

const getCustomerName = (order) => {
  const customer = getCustomer(order);

  if (typeof customer === "string") {
    return order?.customerName || order?.name || customer;
  }

  return (
    customer?.name ||
    [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") ||
    order?.customerName ||
    order?.name ||
    "Customer"
  );
};

const getItems = (order) =>
  order?.items ?? order?.products ?? order?.orderItems ?? [];

const getItemName = (item) =>
  item?.name ||
  item?.productName ||
  item?.product?.name ||
  "Product";

const getItemPrice = (item) =>
  Number(item?.price ?? item?.unitPrice ?? item?.product?.price ?? 0);

const getItemQuantity = (item) =>
  Number(item?.quantity ?? item?.qty ?? 1);

const getOrderTotal = (order) => {
  if (order?.totalAmount != null) return Number(order.totalAmount);
  if (order?.total != null) return Number(order.total);
  if (order?.grandTotal != null) return Number(order.grandTotal);

  return getItems(order).reduce(
    (sum, item) => sum + getItemPrice(item) * getItemQuantity(item),
    0
  );
};

const getAddress = (order) => {
  const address =
    order?.shippingAddress ??
    order?.deliveryAddress ??
    order?.address ??
    {};

  if (typeof address === "string") {
    return {
      address,
      city: order?.city || "",
      district: order?.district || "",
      postalCode: order?.postalCode || "",
    };
  }

  return {
    address:
      address?.address ??
      address?.street ??
      address?.line1 ??
      order?.street ??
      "",
    city: address?.city ?? order?.city ?? "",
    district: address?.district ?? order?.district ?? "",
    postalCode: address?.postalCode ?? order?.postalCode ?? "",
  };
};

const getInitialForm = (order) => {
  const customer = getCustomer(order);
  const address = getAddress(order);

  return {
    customerName:
      typeof customer === "string"
        ? order?.customerName || order?.name || customer
        : getCustomerName(order),
    email:
      (typeof customer === "object" ? customer?.email : "") ||
      order?.email ||
      "",
    phone:
      (typeof customer === "object"
        ? customer?.phone || customer?.phoneNumber
        : "") ||
      order?.phone ||
      order?.phoneNumber ||
      "",
    address: address.address,
    city: address.city,
    district: address.district,
    postalCode: address.postalCode,
    status: order?.status || "Pending",
    paymentMethod:
      order?.paymentMethod || order?.paymentType || "Not specified",
    note: order?.note || order?.deliveryNote || "",
  };
};

function StatusBadge({ status }) {
  const normalized = ORDER_STATUSES.find(
    (item) => item.toLowerCase() === String(status || "").toLowerCase()
  ) || "Pending";

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

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  multiline = false,
}) {
  const classes =
    "w-full rounded-xl border border-white/10 bg-[#080d17] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10";

  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-semibold text-slate-400">
        {label}
        {required && <span className="ml-1 text-emerald-400">*</span>}
      </span>

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${classes} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          className={classes}
        />
      )}
    </label>
  );
}

function OrderModal({ order, onClose, onSave, saving }) {
  const [form, setForm] = useState(() => getInitialForm(order));
  const items = getItems(order);
  const subtotal = items.reduce(
    (sum, item) => sum + getItemPrice(item) * getItemQuantity(item),
    0
  );

  const setField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

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

    if (!form.customerName.trim()) {
      toast.error("Please enter the customer's name.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter the customer's phone number.");
      return;
    }

    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div className="flex max-h-[96dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0b1120] shadow-2xl shadow-black/50 sm:max-h-[92vh] sm:rounded-3xl">
        {/* Modal heading */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.08] bg-gradient-to-r from-emerald-400/[0.08] to-transparent px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
              <FiShoppingBag size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Order management
              </p>
              <h2 className="mt-1 break-all text-lg font-bold text-white sm:text-xl">
                Order #{String(getOrderId(order)).slice(-12)}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Placed {formatDate(order?.createdAt || order?.date)}
              </p>
            </div>
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

        {/* Editable form */}
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
            {/* Status and payment */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <FiPackage className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Order status
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-400">
                    Status
                  </span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setField("status", event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#080d17] px-3.5 py-3 text-sm text-white outline-none focus:border-emerald-400/60"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <FormField
                  label="Payment method"
                  value={form.paymentMethod}
                  onChange={(value) => setField("paymentMethod", value)}
                  placeholder="Cash on delivery, Card..."
                />
              </div>
            </section>

            {/* Customer information */}
            <section className="border-t border-white/[0.07] pt-5">
              <div className="mb-4 flex items-center gap-2">
                <FiUser className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Customer information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Full name"
                  value={form.customerName}
                  onChange={(value) => setField("customerName", value)}
                  placeholder="Customer name"
                  required
                />

                <FormField
                  label="Phone number"
                  value={form.phone}
                  onChange={(value) => setField("phone", value)}
                  placeholder="07X XXX XXXX"
                  type="tel"
                  required
                />

                <div className="sm:col-span-2">
                  <FormField
                    label="Email address"
                    value={form.email}
                    onChange={(value) => setField("email", value)}
                    placeholder="customer@example.com"
                    type="email"
                  />
                </div>
              </div>
            </section>

            {/* Delivery information */}
            <section className="border-t border-white/[0.07] pt-5">
              <div className="mb-4 flex items-center gap-2">
                <FiMapPin className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Delivery information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField
                    label="Delivery address"
                    value={form.address}
                    onChange={(value) => setField("address", value)}
                    placeholder="House number, street, village..."
                    multiline
                  />
                </div>

                <FormField
                  label="City"
                  value={form.city}
                  onChange={(value) => setField("city", value)}
                  placeholder="City"
                />

                <FormField
                  label="District"
                  value={form.district}
                  onChange={(value) => setField("district", value)}
                  placeholder="District"
                />

                <FormField
                  label="Postal code"
                  value={form.postalCode}
                  onChange={(value) => setField("postalCode", value)}
                  placeholder="Postal code"
                />

                <div className="sm:col-span-2">
                  <FormField
                    label="Delivery note"
                    value={form.note}
                    onChange={(value) => setField("note", value)}
                    placeholder="Optional delivery instructions..."
                    multiline
                  />
                </div>
              </div>
            </section>

            {/* Items */}
            <section className="border-t border-white/[0.07] pt-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FiShoppingBag className="text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Ordered products
                  </h3>
                </div>

                <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                  {items.reduce(
                    (sum, item) => sum + getItemQuantity(item),
                    0
                  )}{" "}
                  items
                </span>
              </div>

              {items.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-white/[0.07]">
                  <div className="hidden grid-cols-[1fr_auto_auto] gap-4 bg-white/[0.03] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:grid">
                    <span>Product</span>
                    <span>Qty</span>
                    <span className="text-right">Subtotal</span>
                  </div>

                  <div className="divide-y divide-white/[0.06]">
                    {items.map((item, index) => (
                      <div
                        key={
                          item?._id ||
                          item?.productID ||
                          item?.productId ||
                          index
                        }
                        className="flex items-start justify-between gap-3 px-3 py-4 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4 sm:px-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-semibold text-slate-200">
                            {getItemName(item)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatMoney(getItemPrice(item))} each
                          </p>
                          <p className="mt-1 text-xs text-slate-400 sm:hidden">
                            Quantity: {getItemQuantity(item)}
                          </p>
                        </div>

                        <span className="hidden text-sm text-slate-400 sm:block">
                          × {getItemQuantity(item)}
                        </span>

                        <span className="shrink-0 text-right text-sm font-bold text-white">
                          {formatMoney(
                            getItemPrice(item) * getItemQuantity(item)
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 p-5 text-center text-sm text-slate-500">
                  No product items were found for this order.
                </div>
              )}

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-4">
                <div>
                  <p className="text-xs text-slate-400">Order total</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Subtotal of listed products: {formatMoney(subtotal)}
                  </p>
                </div>

                <p className="text-xl font-extrabold text-emerald-300">
                  {formatMoney(getOrderTotal(order))}
                </p>
              </div>
            </section>

            <div className="flex items-start gap-2 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-3 text-xs leading-5 text-slate-400">
              <FiAlertCircle className="mt-0.5 shrink-0 text-amber-300" />
              <p>
                Changes will be submitted to the server when you save. Product
                quantities and prices are displayed for review and are not
                editable in this form.
              </p>
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-white/[0.08] bg-[#0b1120] p-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#07120f] shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <FiRefreshCw className="animate-spin" />
                  Saving changes...
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/orders`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.orders || response.data?.result || [];

      setOrders(
        data.map((order) => ({
          ...order,
          status: order.status || "Pending",
        }))
      );
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error(
        error.response?.data?.message || "Could not load orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        String(getOrderId(order)).toLowerCase().includes(query) ||
        getCustomerName(order).toLowerCase().includes(query) ||
        String(
          getCustomer(order)?.email || order?.email || ""
        ).toLowerCase().includes(query) ||
        String(
          getCustomer(order)?.phone ||
            order?.phone ||
            order?.phoneNumber ||
            ""
        ).toLowerCase().includes(query);

      const normalizedStatus = ORDER_STATUSES.find(
        (status) =>
          status.toLowerCase() ===
          String(order.status || "Pending").toLowerCase()
      ) || "Pending";

      return (
        matchesSearch &&
        (statusFilter === "All" || normalizedStatus === statusFilter)
      );
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const visibleOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter(
        (order) =>
          String(order.status || "Pending").toLowerCase() === "pending"
      ).length,
      processing: orders.filter(
        (order) => String(order.status).toLowerCase() === "processing"
      ).length,
      completed: orders.filter(
        (order) => String(order.status).toLowerCase() === "completed"
      ).length,
    }),
    [orders]
  );

  const saveOrder = async (form) => {
    if (!selectedOrder) return;

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const id = getOrderId(selectedOrder);

      // This assumes the backend supports PUT /orders/:id
      // and accepts the fields below. Adapt the payload to your schema.
      const payload = {
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        shippingAddress: {
          address: form.address.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          postalCode: form.postalCode.trim(),
        },
        status: form.status,
        paymentMethod: form.paymentMethod.trim(),
        deliveryNote: form.note.trim(),
      };

      const response = await axios.put(`${API_URL}/orders/${id}`, payload, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      const updatedOrder =
        response.data?.order || response.data?.updatedOrder || response.data;

      setOrders((current) =>
        current.map((order) =>
          String(getOrderId(order)) === String(id)
            ? {
                ...order,
                ...payload,
                ...(updatedOrder && typeof updatedOrder === "object"
                  ? updatedOrder
                  : {}),
                status: form.status,
              }
            : order
        )
      );

      toast.success("Order updated successfully.");
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error(
        error.response?.data?.message ||
          "Could not save the order. Check your backend update route."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-w-0 space-y-6 text-slate-100">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Store management
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Orders
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            View customer orders, manage delivery information, and update
            order status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrders(true)}
          disabled={loading || refreshing}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-emerald-300 disabled:opacity-50 sm:self-auto"
        >
          <FiRefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh orders
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: "Total orders",
            value: stats.total,
            icon: FiShoppingBag,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: FiClock,
            color: "text-amber-300",
            bg: "bg-amber-400/10",
          },
          {
            label: "Processing",
            value: stats.processing,
            icon: FiRefreshCw,
            color: "text-sky-300",
            bg: "bg-sky-400/10",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: FiCheckCircle,
            color: "text-emerald-300",
            bg: "bg-emerald-400/10",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-white/[0.04] sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-400 sm:text-sm">
                  {stat.label}
                </span>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                >
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
        {/* Search and filters */}
        <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="font-bold text-white">All orders</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredOrders.length} matching order
              {filteredOrders.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 sm:min-w-[250px]">
              <FiSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                size={17}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ID, customer, email..."
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
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders table */}
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
                  {visibleOrders.map((order) => {
                    const id = getOrderId(order);

                    return (
                      <tr
                        key={id}
                        className="group transition-colors hover:bg-emerald-400/[0.025]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-bold text-white">
                            #{String(id).slice(-12)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {getItems(order).length} product type
                            {getItems(order).length === 1 ? "" : "s"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[190px] truncate text-sm font-semibold text-slate-200">
                            {getCustomerName(order)}
                          </p>
                          <p className="mt-1 max-w-[190px] truncate text-xs text-slate-500">
                            {getCustomer(order)?.email || order.email || "No email"}
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
                            {formatMoney(getOrderTotal(order))}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={order.status || "Pending"} />
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-300">
                  {(page - 1) * pageSize + 1}
                </span>
                {" – "}
                <span className="font-semibold text-slate-300">
                  {Math.min(page * pageSize, filteredOrders.length)}
                </span>{" "}
                of {filteredOrders.length} orders
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
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
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

      {/* Order details modal */}
      {selectedOrder && (
        <OrderModal
          key={String(getOrderId(selectedOrder))}
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
