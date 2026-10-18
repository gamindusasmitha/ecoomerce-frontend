
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiShoppingCart,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiArrowUpRight,
  FiCpu,
} from "react-icons/fi";
import { useTheme } from "../src/context/ThemeContext";
import UserData from "./userData";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const headerStyle = isDark
    ? "border-white/10 bg-[#080d17]/90 text-white"
    : "border-slate-200 bg-white/90 text-slate-900";

  const navLinkClass = ({ isActive }) =>
    `group relative flex items-center py-2 text-sm font-semibold transition-colors duration-300 ${
      isActive
        ? "text-emerald-400"
        : isDark
        ? "text-slate-300 hover:text-emerald-300"
        : "text-slate-600 hover:text-emerald-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-emerald-400/10 text-emerald-400"
        : isDark
        ? "text-slate-300 hover:bg-white/5 hover:text-emerald-300"
        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
    }`;

  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    { label: "Home", to: "/", end: true },
    { label: "Products", to: "/products" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-2xl transition-colors duration-300 ${headerStyle}`}
    >
      {/* Soft futuristic background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 left-1/3 h-32 w-64 rounded-full bg-emerald-400/[0.06] blur-3xl" />
        <div className="absolute right-0 top-0 h-20 w-40 bg-cyan-400/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-6 lg:min-h-[82px] lg:px-10 xl:px-14">
        {/* Logo and brand */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
          aria-label="I-Computer home"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] transition duration-300 group-hover:border-emerald-400/50 group-hover:bg-emerald-400/[0.14] sm:h-12 sm:w-12">
            <img
              src="/logo.png"
              alt="I-Computer logo"
              className="h-9 w-9 object-contain sm:h-11 sm:w-11"
            />
          </div>

          <div className="min-w-0">
            <h1 className="whitespace-nowrap text-sm font-extrabold tracking-[0.08em] sm:text-lg lg:text-xl">
              I-COMPUTER
            </h1>
            <p className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-400 sm:block sm:text-[10px]">
              Next-Gen Hardware
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 lg:flex xl:gap-8"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* Right-side actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Explore products: desktop only */}
          <Link
            to="/products"
            className="group hidden items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm font-bold text-emerald-400 transition duration-300 hover:border-emerald-300 hover:bg-emerald-400 hover:text-slate-950 xl:inline-flex"
          >
            Explore Products
            <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          {/* User information: desktop and larger tablets */}
          <div className="hidden items-center md:flex">
            <UserData />
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition duration-300 hover:rotate-6 ${
              isDark
                ? "border-white/10 bg-white/5 text-amber-300 hover:border-emerald-400/40 hover:bg-emerald-400/10"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:border-emerald-400/50 hover:bg-emerald-50"
            }`}
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Cart: icon on small screens, full button on desktop */}
          <Link
            to="/cart"
            onClick={closeMenu}
            aria-label="Shopping cart"
            className={`relative flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border px-2.5 text-sm font-bold transition duration-300 sm:px-3 lg:px-4 ${
              isDark
                ? "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-300 hover:border-emerald-400/60 hover:bg-emerald-400/15"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100"
            }`}
          >
            <FiShoppingCart size={19} />
            <span className="hidden lg:inline">Cart</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition duration-300 lg:hidden ${
              isDark
                ? "border-white/10 bg-white/5 text-emerald-300 hover:border-emerald-400/40 hover:bg-emerald-400/10"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:border-emerald-400/50 hover:bg-emerald-50"
            }`}
          >
            {menuOpen ? <FiX size={21} /> : <FiMenu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile and tablet navigation */}
      <div
        id="mobile-navigation"
        className={`relative grid transition-[grid-template-rows,opacity] duration-300 ease-in-out lg:hidden ${
          menuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Mobile navigation"
            className={`border-t px-3 pb-4 pt-3 sm:px-6 ${
              isDark ? "border-white/10" : "border-slate-200"
            }`}
          >
            <div className="mx-auto flex max-w-2xl flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeMenu}
                  tabIndex={menuOpen ? 0 : -1}
                  className={mobileLinkClass}
                >
                  {item.label}
                  <FiArrowUpRight className="opacity-40" />
                </NavLink>
              ))}

              {/* Account section for mobile */}
              <div
                className={`mt-2 border-t px-3 py-3 md:hidden ${
                  isDark ? "border-white/10" : "border-slate-200"
                }`}
              >
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
                  Your Account
                </p>
                <UserData />
              </div>

              <Link
                to="/products"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-400/10 transition duration-300 hover:bg-emerald-300"
              >
                <FiCpu size={17} />
                Explore Products
                <FiArrowUpRight size={17} />
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/40 to-cyan-400/20" />
    </header>
  );
}
