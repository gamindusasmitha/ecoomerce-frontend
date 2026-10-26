
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import {
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiStar,
  FiMenu,
  FiX,
  FiLogOut,
  FiShield,
  FiChevronRight,
  FiCpu,
} from "react-icons/fi";

import AdminProductPage from "./admin/adminProductPage";
import AdminAddProductPage from "./admin/adminAddProduct";
import AdminUpdateProductPage from "./admin/adminUpdateProduct";
import AdminOrdersPage from "./admin/adminOrdersPage";
import UserPage from './admin/adminUserPage';
import { BiHome } from "react-icons/bi";

const navigationItems = [
  { name: "Orders", path: "/admin", icon: FiShoppingBag, end: true },
  { name: "Products", path: "/admin/products", icon: FiPackage },
  { name: "Users", path: "/admin/users", icon: FiUsers },
  { name: "Reviews", path: "/admin/reviews", icon: FiStar },
  { name: "Home page", path: "/", icon: BiHome }
];

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifyAdmin() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!isMounted) return;

        if (response.data.role === "admin") {
          setUser(response.data);
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        if (!isMounted) return;

        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verifyAdmin();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const currentPage =
    navigationItems.find((item) =>
      item.end
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path)
    )?.name ||
    (location.pathname.includes("add-product")
      ? "Add Product"
      : location.pathname.includes("update-product")
      ? "Update Product"
      : "Dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080d17] px-4">
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <FiCpu className="text-3xl text-emerald-400" />
            <span className="absolute inset-0 animate-ping rounded-2xl border border-emerald-400/20" />
          </div>

          <div className="text-center">
            <p className="font-semibold tracking-wide text-white">
              I-COMPUTER ADMIN
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Verifying administrator access...
            </p>
          </div>

          <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#080d17] text-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/[0.07] bg-[#0b1120] transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08]">
              <img
                src="/logo.png"
                alt="I-Computer logo"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div>
              <h1 className="text-base font-extrabold tracking-[0.08em] text-white">
                I-COMPUTER
              </h1>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Admin Console
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Admin identity */}
        <div className="mx-4 mt-5 rounded-2xl border border-emerald-400/10 bg-gradient-to-br from-emerald-400/[0.10] to-cyan-400/[0.03] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-lg font-bold text-[#07120f] shadow-lg shadow-emerald-400/10">
              {(user.name || user.firstName || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {user.name || user.firstName || "Administrator"}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 pb-3 pt-7">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `group relative flex min-h-12 items-center gap-3 overflow-hidden rounded-xl px-3.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border border-emerald-400/15 bg-emerald-400/[0.10] text-emerald-300 shadow-sm shadow-emerald-950/20"
                      : "border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-emerald-400" />
                    )}

                    <Icon
                      size={19}
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-emerald-400" : ""
                      }`}
                    />

                    <span>{item.name}</span>

                    <FiChevronRight
                      className={`ml-auto transition-all duration-200 ${
                        isActive
                          ? "translate-x-0 text-emerald-400 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-white/[0.07] p-4">
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-3">
            <FiShield className="shrink-0 text-emerald-400" size={17} />
            <div>
              <p className="text-xs font-semibold text-slate-300">
                Secure Workspace
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Admin access enabled
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3.5 py-3 text-sm font-semibold text-slate-400 transition hover:border-red-400/10 hover:bg-red-400/[0.07] hover:text-red-400"
          >
            <FiLogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main panel */}
      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] bg-[#080d17]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-400 lg:hidden"
            >
              <FiMenu size={20} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="hidden sm:inline">Workspace</span>
                <FiChevronRight className="hidden sm:block" />
                <span className="truncate text-emerald-400">
                  {currentPage}
                </span>
              </div>

              <h2 className="mt-1 truncate text-lg font-bold tracking-tight text-white sm:text-xl">
                {currentPage}
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium text-emerald-300">
                System active
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold text-emerald-300">
              {(user.name || user.firstName || "A")
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <section className="min-w-0 flex-1 p-3 sm:p-5 lg:p-8">
          <div className="min-h-full rounded-2xl border border-white/[0.06] bg-[#0b1120]/70 p-3 shadow-2xl shadow-black/10 sm:p-5 lg:rounded-3xl lg:p-7">
            <Routes>
              <Route path="/" element={<AdminOrdersPage />} />

              <Route
                path="/products"
                element={<AdminProductPage />}
              />

              <Route
                path="/add-product"
                element={<AdminAddProductPage />}
              />

              <Route
                path="/update-product"
                element={<AdminUpdateProductPage />}
              />

              <Route
                path="/users"
                element={
                  <UserPage/>
                }
              />

              <Route
                path="/reviews"
                element={
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
                    <FiStar className="mb-4 text-3xl text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">
                      Reviews
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      The review management page will appear here.
                    </p>
                  </div>
                }
              />
              

              <Route
                path="*"
                element={
                  <div className="p-8 text-center">
                    <h2 className="text-xl font-bold text-white">
                      Page not found
                    </h2>
                    <button
                      type="button"
                      onClick={() => navigate("/admin")}
                      className="mt-4 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                    >
                      Back to Orders
                    </button>
                  </div>
                }
              />
            </Routes>
          </div>
        </section>
      </main>
    </div>
  );
}
