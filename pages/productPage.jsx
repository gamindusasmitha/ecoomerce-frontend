
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiX, FiRefreshCw, FiPackage } from "react-icons/fi";
import ProductCard from "../components/productCard";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");

    const fetchProducts = () => {
        setLoaded(false);
        setError("");

        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/products")
            .then((response) => {
                // Support APIs that return an array directly
                // or an object containing a products array.
                const data = response.data;
                const productList = Array.isArray(data)
                    ? data
                    : Array.isArray(data.products)
                    ? data.products
                    : [];

                setProducts(productList);
                setLoaded(true);
            })
            .catch((err) => {
                console.error("Failed to load products:", err);
                setError("We couldn't load the products. Please try again.");
                setLoaded(true);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Create a list of available categories.
    const categories = useMemo(() => {
        return [
            "All",
            ...new Set(
                products
                    .map((product) => product.category)
                    .filter(Boolean)
            ),
        ];
    }, [products]);

    // Search by product name, ID, category, brand or description.
    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products.filter((product) => {
            const searchableText = [
                product.name,
                product.productID,
                product.category,
                product.brand,
                product.description,
                ...(Array.isArray(product.altNames)
                    ? product.altNames
                    : []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = searchableText.includes(query);
            const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("All");
    };

    return (
        <main className="min-h-[calc(100vh-100px)] w-full bg-[#080d17] px-4 py-8 text-white sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl">

                {/* Page heading */}
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                        I-Computer Store
                    </p>

                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Explore Products
                            </h1>
                            <p className="mt-2 text-sm text-gray-400 sm:text-base">
                                Find the right tech for your setup.
                            </p>
                        </div>

                        {loaded && !error && (
                            <p className="text-sm text-gray-400">
                                <span className="font-semibold text-emerald-400">
                                    {filteredProducts.length}
                                </span>{" "}
                                {filteredProducts.length === 1
                                    ? "product"
                                    : "products"}{" "}
                                found
                            </p>
                        )}
                    </div>
                </div>

                {/* Search and filters */}
                <section className="mb-8 rounded-2xl border border-white/10 bg-[#101827] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                        {/* Search bar */}
                        <div className="relative min-w-0 flex-1">
                            <FiSearch
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400"
                                aria-hidden="true"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products, brands, categories..."
                                aria-label="Search products"
                                className="w-full rounded-xl border border-white/10 bg-[#080d17] py-3.5 pl-12 pr-11 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                                >
                                    <FiX size={18} />
                                </button>
                            )}
                        </div>

                        {/* Refresh button */}
                        <button
                            type="button"
                            onClick={fetchProducts}
                            disabled={!loaded}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-emerald-400/50 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <FiRefreshCw size={16} />
                            Refresh
                        </button>
                    </div>

                    {/* Category filter */}
                    {loaded && !error && categories.length > 1 && (
                        <div className="mt-5">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Categories
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory(category)
                                        }
                                        aria-pressed={
                                            selectedCategory === category
                                        }
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                            selectedCategory === category
                                                ? "border-emerald-400 bg-emerald-400 text-[#080d17]"
                                                : "border-white/10 bg-[#080d17] text-gray-300 hover:border-emerald-400/50 hover:text-emerald-400"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Loading state */}
                {!loaded && (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
                        <p className="text-sm text-gray-400">
                            Loading products...
                        </p>
                    </div>
                )}

                {/* Error state */}
                {loaded && error && (
                    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-red-400/20 bg-[#101827] p-6 text-center">
                        <p className="mb-2 text-lg font-semibold text-white">
                            Something went wrong
                        </p>
                        <p className="mb-5 max-w-md text-sm text-gray-400">
                            {error}
                        </p>
                        <button
                            type="button"
                            onClick={fetchProducts}
                            className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-[#080d17] transition hover:bg-emerald-300"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Product grid */}
                {loaded && !error && filteredProducts.length > 0 && (
                    <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((item) => (
                            <ProductCard
                                key={item.productID}
                                product={item}
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {loaded && !error && filteredProducts.length === 0 && (
                    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#101827]/60 px-6 py-10 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                            <FiPackage size={30} />
                        </div>

                        <h2 className="text-xl font-semibold text-white">
                            No products found
                        </h2>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
                            Try a different product name or choose another
                            category.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#080d17] transition hover:bg-emerald-300"
                        >
                            Clear search and filters
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
