
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../public/logo.png";
import { useTheme } from "../src/context/ThemeContext";
import { FiShoppingCart } from "react-icons/fi";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinkClass = ({ isActive }) =>
    `relative py-2 text-sm font-medium transition duration-300
     ${
       isActive
         ? "text-emerald-400"
         : "text-gray-300 hover:text-emerald-300"
     }`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-400/10 bg-[#0b1120]/95 text-white shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-4 sm:px-8 lg:px-12">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-3"
        >
          <img
            src={logo}
            alt="Computer Shop Logo"
            className="h-12 w-12 object-contain transition duration-300 hover:scale-105"
          />

          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-wide text-white">
              I-COMPUTER
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-emerald-400">
              Next-Gen Hardware
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex lg:gap-10">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Right-side action */}
        <div className="hidden md:block">
          <Link
            to="/products"
            className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition duration-300 hover:border-emerald-300 hover:bg-emerald-400 hover:text-gray-950"
          >
            Explore Products <span className="ml-1">↗</span>
          </Link>
        </div>

        
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            title="Toggle theme"
            className="flex h-11 w-11 items-center justify-center
             rounded-xl border border-white/10 bg-white/5
             text-xl transition hover:border-emerald-400/50
             hover:bg-emerald-400/10"
            >
            {theme === "dark" ? "☀️" : "🌙"}
        </button>


        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl text-emerald-300 transition hover:bg-white/10 md:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-white/10 bg-[#0b1120] px-5 py-4 shadow-xl md:hidden">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={closeMenu}
              className={navLinkClass}
            >
              Products
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMenu}
              className={navLinkClass}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={navLinkClass}
            >
              Contact
            </NavLink>

            <Link
              to="/products"
              onClick={closeMenu}
              className="mt-3 rounded-xl bg-emerald-400 px-4 py-3 text-center text-sm font-semibold text-gray-950 transition hover:bg-emerald-300"
            >
              Explore Products ↗
            </Link>
          </div>
        </nav>
      )}

      <Link
  to="/cart"
  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-400/10"
>
  <FiShoppingCart />
  Cart
</Link>

      {/* Subtle bottom accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
    </header>
  );
}


