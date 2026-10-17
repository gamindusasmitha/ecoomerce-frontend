
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShield } from "react-icons/fi";

const CART_KEY = "cart";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const getId = (item) => item.productID || item._id;

  const getPrice = (item) =>
    Number(item.price ?? item.product?.price ?? 0);

  const getImage = (item) =>
    item.images?.[0] || item.product?.images?.[0] || "";

  const getName = (item) =>
    item.name || item.product?.name || "Product";

  const updateQuantity = (id, change) => {
    setCart((items) =>
      items.map((item) => {
        if (getId(item) !== id) return item;

        const quantity = Number(item.quantity || 1) + change;

        return {
          ...item,
          quantity: Math.max(1, quantity),
        };
      })
    );
  };

  const removeItem = (id) => {
    setCart((items) => items.filter((item) => getId(item) !== id));
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + getPrice(item) * Number(item.quantity || 1),
    0
  );

  const itemCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const formatPrice = (price) =>
    `Rs. ${Number(price).toLocaleString("en-LK", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <main className="min-h-screen bg-[#080d17] px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Page heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              I-Computer Store
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Review your items before proceeding to checkout.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-emerald-400 hover:text-emerald-400"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          /* Empty cart */
          <div className="rounded-2xl border border-white/10 bg-[#101827] px-5 py-16 text-center sm:py-24">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10">
              <FiShoppingBag className="text-4xl text-emerald-400" />
            </div>

            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="mx-auto mt-3 max-w-md text-gray-400">
              Looks like you haven't added anything yet. Explore our
              collection and find something you'll love.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-[#07110d] transition hover:bg-emerald-300"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">

            {/* Cart items */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101827]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                <h2 className="font-semibold">Your Items</h2>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-400">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {cart.map((item) => {
                  const id = getId(item);
                  const quantity = Number(item.quantity || 1);
                  const image = getImage(item);
                  const price = getPrice(item);

                  return (
                    <article
                      key={id}
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6"
                    >
                      {/* Product image */}
                      <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#080d17] sm:w-28">
                        {image ? (
                          <img
                            src={image}
                            alt={getName(item)}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <FiShoppingBag className="text-3xl text-gray-600" />
                        )}
                      </div>

                      {/* Product details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-semibold text-white">
                          {getName(item)}
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          Product ID: {id || "N/A"}
                        </p>

                        <p className="mt-3 text-lg font-bold text-emerald-400">
                          {formatPrice(price)}
                        </p>

                        <button
                          onClick={() => removeItem(id)}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-red-400"
                        >
                          <FiTrash2 />
                          Remove
                        </button>
                      </div>

                      {/* Quantity and line total */}
                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <div className="flex items-center rounded-lg border border-white/10">
                          <button
                            onClick={() => updateQuantity(id, -1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="p-2.5 text-gray-300 transition hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <FiMinus size={14} />
                          </button>

                          <span className="min-w-9 text-center text-sm font-semibold">
                            {quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(id, 1)}
                            aria-label="Increase quantity"
                            className="p-2.5 text-gray-300 transition hover:text-emerald-400"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        <p className="font-semibold">
                          {formatPrice(price * quantity)}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="border-t border-white/10 p-5 sm:p-6">
                <button
                  onClick={() => {
                    setCart([]);
                  }}
                  className="text-sm text-gray-400 transition hover:text-red-400"
                >
                  Clear cart
                </button>
              </div>
            </section>

            {/* Order summary */}
            <aside className="rounded-2xl border border-white/10 bg-[#101827] p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4 text-gray-400">
                  <span>Items ({itemCount})</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between gap-4 text-gray-400">
                  <span>Delivery</span>
                  <span className="text-white">Calculated at checkout</span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">Subtotal</span>
                    <span className="text-xl font-bold text-emerald-400">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Delivery charges, if any, are not included.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 font-bold text-[#07110d] transition hover:bg-emerald-300"
              >
                Proceed to Checkout
                <FiArrowLeft className="rotate-180" />
              </button>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-white/[0.03] p-3">
                <FiShield className="mt-0.5 shrink-0 text-emerald-400" />
                <p className="text-xs leading-5 text-gray-400">
                  Review your order carefully before confirming your purchase.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
