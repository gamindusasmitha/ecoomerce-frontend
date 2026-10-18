
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BiPlus, BiEdit } from "react-icons/bi";
import {
  FiPackage,
  FiSearch,
  FiRefreshCw,
  FiBox,
  FiAlertCircle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import ProductDeleteButton from "../../components/product DeleteButton";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setRefreshing(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/products`
      );

      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoaded(true);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      product.name,
      product.productID,
      product.brand,
      product.category,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  const availableCount = products.filter(
    (product) => product.isAvailable && product.stock > 0
  ).length;

  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const money = (value) =>
    `Rs. ${Number(value || 0).toLocaleString("en-LK")}`;

  return (
    <div className="min-w-0 space-y-6 text-slate-100">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Inventory management
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Products
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage your products, prices, availability, and inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={refreshing}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-emerald-300 disabled:opacity-50"
          >
            <FiRefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            to="/admin/add-product"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#07120f] shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 sm:px-5"
          >
            <BiPlus className="text-xl" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-emerald-400/20 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">Total products</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <FiPackage size={20} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {products.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Products in your store</p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-emerald-400/20 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">Available in stock</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <FiBox size={20} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {availableCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Available products with stock
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-amber-400/20 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">Low stock</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <FiAlertCircle size={20} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {lowStockCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Products with 1–5 units left
          </p>
        </div>
      </div>

      {/* Products table panel */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b1120]/80">
        {/* Table toolbar */}
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-white">Product inventory</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredProducts.length} product
              {filteredProducts.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <FiSearch
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, ID, brand..."
              aria-label="Search products"
              className="h-11 w-full rounded-xl border border-white/10 bg-[#080d17] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
            />
          </div>
        </div>

        {/* Loading state */}
        {!loaded ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06]">
              <FiPackage size={25} className="text-emerald-400" />
              <span className="absolute inset-0 animate-ping rounded-2xl border border-emerald-400/20" />
            </div>

            <p className="text-sm font-medium text-slate-400">
              Loading products...
            </p>

            <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-400" />
            </div>
          </div>
        ) : products.length === 0 ? (
          /* Empty inventory */
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-500">
              <FiPackage size={28} />
            </div>

            <h3 className="mt-4 font-bold text-white">No products yet</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Your inventory is empty. Add your first product to get started.
            </p>

            <Link
              to="/admin/add-product"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#07120f] transition hover:bg-emerald-300"
            >
              <BiPlus className="text-xl" />
              Add your first product
            </Link>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">
            <FiSearch size={28} className="text-slate-500" />
            <h3 className="mt-4 font-bold text-white">No matching products</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another name, product ID, brand, or category.
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-white/[0.07] bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Product ID</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.05]">
                {filteredProducts.map((item) => (
                  <tr
                    key={item.productID}
                    className="group transition-colors hover:bg-emerald-400/[0.025]"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#080d17]">
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <FiPackage size={20} className="text-slate-600" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[200px] truncate text-sm font-semibold text-slate-200">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.brand || "No brand"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Product ID */}
                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 font-mono text-xs text-slate-400">
                        {item.productID}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-flex whitespace-nowrap rounded-lg border border-cyan-400/10 bg-cyan-400/[0.06] px-2.5 py-1.5 text-xs font-medium text-cyan-300">
                        {item.category || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="text-sm font-bold text-white">
                        {money(item.price)}
                      </p>

                      {item.labelledPrice != null && (
                        <p className="mt-1 text-xs text-slate-500 line-through">
                          {money(item.labelledPrice)}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.stock <= 0
                              ? "bg-red-400"
                              : item.stock <= 5
                              ? "bg-amber-300"
                              : "bg-emerald-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            item.stock <= 0
                              ? "text-red-300"
                              : item.stock <= 5
                              ? "text-amber-300"
                              : "text-emerald-300"
                          }`}
                        >
                          {item.stock ?? 0}
                        </span>
                      </div>
                    </td>

                    {/* Availability */}
                    <td className="px-5 py-4">
                      {item.isAvailable && item.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-xs font-semibold text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-red-400/15 bg-red-400/[0.07] px-2.5 py-1 text-xs font-semibold text-red-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          {item.stock <= 0 ? "Out of stock" : "Unavailable"}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate("/admin/update-product", {
                              state: item,
                            })
                          }
                          aria-label={`Edit ${item.name}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-xs font-bold text-emerald-300 transition hover:border-emerald-400/40 hover:bg-emerald-400 hover:text-[#07120f]"
                        >
                          <BiEdit size={17} />
                          Edit
                        </button>

                        <ProductDeleteButton
                          productID={item.productID}
                          onDeleted={fetchProducts}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {loaded && filteredProducts.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-white/[0.07] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-300">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-300">
                {products.length}
              </span>{" "}
              products
            </p>

            <p className="text-xs text-slate-500">
              Inventory{" "}
              <span className="font-semibold text-emerald-400">●</span>{" "}
              <span className="text-slate-400">Updated from store data</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
