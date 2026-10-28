
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const inStock = product.isAvailable && Number(product.stock) > 0;

  return (
    <div
      className="group relative m-4 w-full max-w-[320px] overflow-hidden
                 rounded-2xl border border-white/10 bg-[#111827]
                 shadow-lg shadow-black/20 transition-all duration-300
                 hover:-translate-y-2 hover:border-emerald-400/50
                 hover:shadow-xl hover:shadow-emerald-500/10"
    >
      {/* Top accent line */}
      <div
        className="absolute left-0 top-0 z-30 h-[2px] w-0
                   bg-emerald-400 transition-all duration-500
                   group-hover:w-full"
      />

      {/* Product image section */}
      <div
        className="relative isolate flex h-56 items-center justify-center
                   overflow-hidden bg-gradient-to-br from-gray-800
                   via-gray-900 to-[#0b1120] p-6"
      >
        {/* Background glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2
                     h-32 w-32 -translate-x-1/2 -translate-y-1/2
                     rounded-full bg-emerald-400/10 blur-3xl
                     transition-all duration-500
                     group-hover:bg-emerald-400/20"
        />

        {/* Product image */}
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name || "Product"}
            loading="lazy"
            className="relative z-0 h-full w-full object-contain
                       transition-transform duration-500
                       group-hover:scale-105"
          />
        ) : (
          <div className="relative z-0 text-sm text-gray-500">
            No image available
          </div>
        )}

        {/* Availability badge */}
        <span
          className={`absolute right-3 top-3 z-20
                      inline-flex items-center gap-1.5
                      whitespace-nowrap rounded-full border
                      px-3 py-1.5 text-xs font-semibold
                      shadow-lg backdrop-blur-md ${
            inStock
              ? "border-emerald-400/40 bg-[#071b18]/95 text-emerald-300"
              : "border-red-400/40 bg-[#240d12]/95 text-red-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              inStock ? "bg-emerald-400" : "bg-red-400"
            }`}
          />

          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Product details */}
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span
            className="truncate text-xs font-semibold uppercase
                       tracking-[0.18em] text-emerald-400"
          >
            {product.brand || "Computer Components"}
          </span>

          <span className="shrink-0 text-xs text-gray-500">
            {product.category || "Hardware"}
          </span>
        </div>

        <h2
          className="mb-2 line-clamp-2 min-h-12 text-lg font-bold
                     leading-6 text-white transition-colors
                     group-hover:text-emerald-300"
        >
          {product.name}
        </h2>

        <p
          className="mb-4 line-clamp-2 min-h-10 text-sm
                     leading-5 text-gray-400"
        >
          {product.description || "Explore product details."}
        </p>

        {/* Price section */}
        <div
          className="flex items-end justify-between gap-3
                     border-t border-white/10 pt-4"
        >
          <div className="min-w-0">
            <p className="mb-1 text-xs text-gray-500">Price</p>

            <p className="truncate text-xl font-bold text-white">
              Rs. {Number(product.price || 0).toLocaleString("en-LK")}
            </p>

            {Number(product.labelledPrice) > Number(product.price) && (
              <p className="text-sm text-gray-500 line-through">
                Rs.{" "}
                {Number(product.labelledPrice).toLocaleString("en-LK")}
              </p>
            )}
          </div>

          {/* View button */}
          <Link
            to={`/products/overview/${encodeURIComponent(
              product.productID
            )}`}
            className="shrink-0 rounded-xl border
                       border-emerald-400/30 bg-emerald-400/10
                       px-4 py-2.5 text-sm font-semibold
                       text-emerald-300 transition-all duration-200
                       hover:bg-emerald-400 hover:text-gray-950
                       active:scale-95"
          >
            View Details
            <span className="ml-1" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
