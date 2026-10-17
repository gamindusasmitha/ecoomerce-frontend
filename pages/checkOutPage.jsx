
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCreditCard,
  FiShield,
  FiTruck,
  FiCheckCircle,
  FiShoppingBag,
  
} from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";

const CART_KEY = "cart";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  district: "",
  postalCode: "",
  deliveryNote: "",
};

const paymentMethods = [
  {
    id: "card",
    title: "Card Payment",
    description: "Pay securely using a debit or credit card.",
    icon: FiCreditCard,
  },
  {
    id: "bank",
    title: "Bank Transfer",
    description: "Transfer the payment to our bank account.",
    icon: MdAccountBalance,
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay when your order is delivered.",
    icon: FiTruck,
  },
  {
    id: "koko",
    title: "Koko Payment",
    description: "Continue to Koko's payment service.",
    icon: FiShoppingBag,
  },
];

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const getId = (item) => item.productID || item._id;

  const getName = (item) =>
    item.name || item.product?.name || "Product";

  const getImage = (item) =>
    item.images?.[0] || item.product?.images?.[0] || "";

  const getPrice = (item) =>
    Number(item.price ?? item.product?.price ?? 0);

  const itemCount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Math.max(1, Number(item.quantity) || 1),
        0
      ),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          getPrice(item) *
            Math.max(1, Number(item.quantity) || 1),
        0
      ),
    [cart]
  );

  // Delivery is not calculated until your store's delivery policy is set.
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const formatPrice = (amount) =>
    `Rs. ${Number(amount).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!agreed) {
      toast.error("Please agree to the order details.");
      return;
    }

    setSubmitting(true);

    const orderDraft = {
      customer: form,
      items: cart.map((item) => ({
        productID: getId(item),
        name: getName(item),
        price: getPrice(item),
        quantity: Math.max(1, Number(item.quantity) || 1),
        image: getImage(item),
      })),
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
      createdAt: new Date().toISOString(),
    };

    // Save a checkout draft only. This does not place or pay for an order.
    localStorage.setItem("checkoutDraft", JSON.stringify(orderDraft));

    setSubmitting(false);

    if (paymentMethod === "card") {
      toast("Connect a secure card payment gateway to continue.");
    } else if (paymentMethod === "bank") {
      toast("Add your verified bank details and order confirmation process.");
    } else if (paymentMethod === "koko") {
      toast("Connect the Koko merchant payment integration to continue.");
    } else {
      toast("Checkout details saved. Connect your backend to place the order.");
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10";

  const labelClass = "text-sm font-medium text-gray-300";

  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d17] px-4 py-12 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101827] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
            <FiShoppingBag className="text-3xl text-emerald-400" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            Add some products to your cart before proceeding to checkout.
          </p>
          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-[#07110d] transition hover:bg-emerald-300"
          >
            Explore Products <FiArrowRight />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080d17] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-emerald-400"
          >
            <FiArrowLeft /> Back to cart
          </Link>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
              I-Computer Store
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Checkout
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Your next upgrade is almost ready. Complete your details below.
            </p>
          </div>

          {/* Progress */}
          <div className="mt-7 flex max-w-lg items-center gap-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-[#07110d]">
                <FiCheckCircle />
              </span>
              <span className="text-sm font-medium">Cart</span>
            </div>
            <div className="h-px flex-1 bg-emerald-400/40" />
            <div className="flex items-center gap-2 text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400 text-sm font-bold text-emerald-400">
                2
              </span>
              <span className="text-sm font-medium">Checkout</span>
            </div>
            <div className="h-px flex-1 bg-white/10" />
            <div className="flex items-center gap-2 text-gray-500">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-sm">
                3
              </span>
              <span className="text-sm">Complete</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* Left: customer and payment forms */}
            <div className="space-y-6">
              {/* Customer information */}
              <section className="rounded-2xl border border-white/10 bg-[#101827] p-5 sm:p-7">
                <div className="mb-6 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <FiTruck className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      Customer & Delivery Details
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                      Tell us who is receiving this order.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Full name *
                    <input
                      className={inputClass}
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                      maxLength={100}
                    />
                  </label>

                  <label className={labelClass}>
                    Phone number *
                    <input
                      className={inputClass}
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="e.g. 07X XXX XXXX"
                      autoComplete="tel"
                      required
                      maxLength={20}
                    />
                  </label>

                  <label className={labelClass + " sm:col-span-2"}>
                    Email address *
                    <input
                      className={inputClass}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      maxLength={150}
                    />
                  </label>

                  <label className={labelClass + " sm:col-span-2"}>
                    Delivery address *
                    <textarea
                      className={inputClass + " min-h-24 resize-y"}
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House number, street, and area"
                      autoComplete="street-address"
                      required
                      maxLength={500}
                    />
                  </label>

                  <label className={labelClass}>
                    City / Town *
                    <input
                      className={inputClass}
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      autoComplete="address-level2"
                      required
                      maxLength={100}
                    />
                  </label>

                  <label className={labelClass}>
                    District *
                    <select
                      className={inputClass}
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      autoComplete="address-level1"
                      required
                    >
                      <option value="" className="bg-[#101827]">
                        Select district
                      </option>
                      {[
                        "Ampara", "Anuradhapura", "Badulla", "Batticaloa",
                        "Colombo", "Galle", "Gampaha", "Hambantota",
                        "Jaffna", "Kalutara", "Kandy", "Kegalle",
                        "Kilinochchi", "Kurunegala", "Mannar", "Matale",
                        "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
                        "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee",
                        "Vavuniya",
                      ].sort().map((district) => (
                        <option
                          key={district}
                          value={district}
                          className="bg-[#101827]"
                        >
                          {district}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Postal code
                    <input
                      className={inputClass}
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 80000"
                      autoComplete="postal-code"
                      maxLength={12}
                    />
                  </label>

                  <label className={labelClass}>
                    Delivery note
                    <input
                      className={inputClass}
                      name="deliveryNote"
                      value={form.deliveryNote}
                      onChange={handleChange}
                      placeholder="Optional instructions"
                      maxLength={250}
                    />
                  </label>
                </div>
              </section>

              {/* Payment methods */}
              <section className="rounded-2xl border border-white/10 bg-[#101827] p-5 sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Choose how you would like to pay.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const selected = paymentMethod === method.id;

                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        aria-pressed={selected}
                        className={`relative flex min-h-28 items-start gap-3 rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-emerald-400 bg-emerald-400/[0.07] ring-1 ring-emerald-400/30"
                            : "border-white/10 bg-[#080d17] hover:border-white/25"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            selected
                              ? "bg-emerald-400/15 text-emerald-400"
                              : "bg-white/5 text-gray-400"
                          }`}
                        >
                          <Icon className="text-xl" />
                        </span>

                        <span className="flex-1">
                          <span className="block pr-5 text-sm font-semibold text-white">
                            {method.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-gray-400">
                            {method.description}
                          </span>
                        </span>

                        <span
                          className={`absolute right-3 top-3 h-4 w-4 rounded-full border ${
                            selected
                              ? "border-4 border-emerald-400"
                              : "border border-gray-600"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Instructions depend on selected payment method */}
                <div className="mt-5 rounded-xl border border-white/10 bg-[#080d17] p-4 sm:p-5">
                  {paymentMethod === "card" && (
                    <div>
                      <h3 className="font-semibold text-white">
                        Card Payment
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        You will need to complete payment through a secure
                        payment gateway. Connect your selected provider before
                        accepting real card payments. Do not collect or store
                        card numbers or CVV details in this form.
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                        <FiShield />
                        Secure gateway integration required
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div>
                      <h3 className="font-semibold text-white">
                        Bank Transfer Instructions
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        Display your verified business bank account details
                        here. Customers should transfer the order amount and
                        provide a payment reference for verification.
                      </p>
                      <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-200">
                        Store owner: replace this message with your actual
                        bank name, account name, account number, and branch.
                        Verify transfers before confirming an order.
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div>
                      <h3 className="font-semibold text-white">
                        Cash on Delivery
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        Pay the delivery person when your order arrives.
                        Please make sure your phone number and delivery
                        address are correct.
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                        <FiTruck />
                        Delivery availability must be confirmed by the store
                      </div>
                    </div>
                  )}

                  {paymentMethod === "koko" && (
                    <div>
                      <h3 className="font-semibold text-white">
                        Koko Payment
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        Koko checkout must be completed through your
                        registered merchant integration. Eligibility,
                        available payment plans, and approval are determined
                        by Koko.
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                        <FiShield />
                        Koko merchant integration required
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Agreement */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#101827] p-4">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-emerald-400"
                  required
                />
                <span className="text-sm leading-6 text-gray-400">
                  I confirm that my contact and delivery details are correct,
                  and I have reviewed the items and total in this order.
                </span>
              </label>
            </div>

            {/* Right: order summary */}
            <aside className="lg:sticky lg:top-24">
              <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101827]">
                <div className="border-b border-white/10 p-5 sm:p-6">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your
                    order
                  </p>
                </div>

                <div className="max-h-80 space-y-4 overflow-y-auto p-5 sm:p-6">
                  {cart.map((item, index) => {
                    const quantity = Math.max(
                      1,
                      Number(item.quantity) || 1
                    );
                    const image = getImage(item);
                    const id = getId(item);

                    return (
                      <div
                        key={id || index}
                        className="flex items-center gap-3"
                      >
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#080d17]">
                          {image ? (
                            <img
                              src={image}
                              alt={getName(item)}
                              className="h-full w-full rounded-xl object-contain p-1"
                            />
                          ) : (
                            <FiShoppingBag className="text-xl text-gray-600" />
                          )}
                          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-[#07110d]">
                            {quantity}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium">
                            {getName(item)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatPrice(getPrice(item))} each
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold">
                          {formatPrice(getPrice(item) * quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-white/10 p-5 sm:p-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4 text-gray-400">
                      <span>Subtotal</span>
                      <span className="text-white">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 text-gray-400">
                      <span>Delivery</span>
                      <span className="text-right text-xs text-gray-300">
                        Confirmed by store
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">Order Total</span>
                      <span className="text-xl font-bold text-emerald-400">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Delivery charges are not included and may change the
                      final amount.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || cart.length === 0}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-4 font-bold text-[#07110d] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Please wait..." : "Continue"}
                    <FiArrowRight />
                  </button>

                  <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-gray-500">
                    <FiShield className="mt-0.5 shrink-0 text-emerald-400" />
                    Your order is not placed until the checkout is connected
                    to your backend and the required payment steps are
                    completed.
                  </div>
                </div>
              </section>

              <Link
                to="/cart"
                className="mt-4 flex items-center justify-center gap-2 py-3 text-sm text-gray-400 transition hover:text-emerald-400"
              >
                <FiArrowLeft /> Return to shopping cart
              </Link>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

    