
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductOverview() {
  const { productID } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      setStatus("loading");
      setProduct(null);
      setSelectedImage("");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products/${productID}`
        );

        // Supports APIs that return either a product or { product: ... }
        const data = response.data?.product ?? response.data;

        if (!data || !data.productID) {
          throw new Error("Product not found");
        }

        if (!cancelled) {
          setProduct(data);
          setSelectedImage(data.images?.[0] || "");
          setStatus("success");
        }
      } catch (error) {
        console.error(
          "Error loading product:",
          error.response?.data || error
        );

        if (!cancelled) {
          setStatus("error");
          toast.error("Unable to load product details");
        }
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [productID]);

  // Loading screen
  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 bg-gray-950 text-white">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
        <p className="animate-pulse text-sm text-gray-400">
          Loading product details...
        </p>
      </div>
    );
  }

  // Error screen
  if (status === "error" || !product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-950 px-5 text-center text-white">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/20 bg-red-400/10 text-3xl text-red-400">
          !
        </div>

        <h1 className="text-2xl font-bold">Product Not Found</h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
          We couldn't load this product. It may have been removed or
          there may be a connection problem.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-7 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-gray-950 transition hover:bg-emerald-300"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const inStock = product.isAvailable && Number(product.stock) > 0;

  const hasDiscount =
    Number(product.labelledPrice) > Number(product.price) &&
    Number(product.labelledPrice) > 0;

  const discount = hasDiscount
    ? Math.round(
        ((Number(product.labelledPrice) - Number(product.price)) /
          Number(product.labelledPrice)) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#080d17] px-4 py-8 text-white sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate("/")}
            className="transition hover:text-emerald-400"
          >
            Home
          </button>

          <span>/</span>

          <button
            onClick={() => navigate("/products")}
            className="transition hover:text-emerald-400"
          >
            Products
          </button>

          <span>/</span>

          <span className="max-w-[200px] truncate text-emerald-400">
            {product.name}
          </span>
        </div>

        {/* Main product section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Product images */}
          <div>
            <div className="group relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#151f30] via-[#0d1422] to-[#080d17] p-8 sm:min-h-[480px]">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-emerald-400/10 blur-[100px] transition duration-500 group-hover:bg-emerald-400/20" />

              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="relative z-10 max-h-[400px] w-full object-contain transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="relative z-10 text-center text-gray-500">
                  <div className="mb-3 text-5xl">▧</div>
                  <p>No product image available</p>
                </div>
              )}

              {hasDiscount && (
                <span className="absolute left-5 top-5 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-300 backdrop-blur">
                  SAVE {discount}%
                </span>
              )}

              <span
                className={`absolute right-5 top-5 rounded-full border px-3 py-2 text-xs font-semibold ${
                  inStock
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-red-400/20 bg-red-400/10 text-red-300"
                }`}
              >
                {inStock ? "● In Stock" : "● Out of Stock"}
              </span>

              <span className="absolute bottom-5 left-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                Product ID · {product.productID}
              </span>
            </div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View product image ${index + 1}`}
                    className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border bg-white/5 p-2 transition ${
                      selectedImage === image
                        ? "border-emerald-400 ring-2 ring-emerald-400/20"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center py-2">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                {product.brand || "Computer Hardware"}
              </span>

              <span className="text-sm text-gray-500">
                {product.category || "General"}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {product.model && (
              <p className="mt-3 text-sm text-gray-500">
                Model:{" "}
                <span className="text-gray-300">{product.model}</span>
              </p>
            )}

            {/* Price */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Our Price
              </p>

              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-emerald-300 sm:text-4xl">
                  LKR{" "}
                  {Number(product.price || 0).toLocaleString("en-LK")}
                </span>

                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    LKR{" "}
                    {Number(product.labelledPrice).toLocaleString("en-LK")}
                  </span>
                )}
              </div>

              {hasDiscount && (
                <p className="mt-3 text-sm text-emerald-400">
                  You save LKR{" "}
                  {(
                    Number(product.labelledPrice) -
                    Number(product.price)
                  ).toLocaleString("en-LK")}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">
                Product Description
              </h2>

              <p className="whitespace-pre-line text-sm leading-7 text-gray-400 sm:text-base">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Stock information */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  inStock ? "bg-emerald-400" : "bg-red-400"
                }`}
              />

              <div>
                <p className="text-sm font-medium text-gray-200">
                  {inStock ? "Available to order" : "Currently unavailable"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {inStock
                    ? `${product.stock} unit(s) available`
                    : "Please check back later"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  if (!inStock) return;
                  toast("Cart functionality is not connected yet.");
                }}
                disabled={!inStock}
                className="flex-1 rounded-xl bg-emerald-400 px-6 py-4 font-bold text-gray-950 shadow-lg shadow-emerald-400/10 transition hover:bg-emerald-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400 disabled:shadow-none"
              >
                {inStock ? "Add to Cart  →" : "Out of Stock"}
              </button>

              <button
                onClick={() => navigate("/products")}
                className="rounded-xl border border-white/15 px-6 py-4 font-semibold text-gray-200 transition hover:border-emerald-400/50 hover:bg-white/5"
              >
                ← Back to Products
              </button>
            </div>

            {/* Trust details */}
            <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <span className="text-xl text-emerald-400">✓</span>
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Quality Products
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Product details at a glance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl text-emerald-400">⌁</span>
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Product Support
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Browse our available products
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
