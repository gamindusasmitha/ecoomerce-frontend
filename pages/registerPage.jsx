
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiCpu,
} from "react-icons/fi";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (loading) return;

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();

    if (!firstName || !lastName || !email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const backendURL = import.meta.env.VITE_BACKEND_URL;

      await axios.post(`${backendURL}/users`, {
        firstName,
        lastName,
        email,
        password: formData.password,
      });

      toast.success("Account created successfully!");

      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#080d17] py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10";

  const labelClass = "mb-2 block text-sm font-medium text-gray-300";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d17] px-4 py-10 text-white sm:px-6">

      {/* Background effects */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#101827]/95 shadow-2xl shadow-black/40 lg:grid-cols-2">

        {/* Left: branding panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#101e2b] via-[#101827] to-[#080d17] p-10 lg:flex xl:p-12">
          <div className="absolute -right-20 top-24 h-64 w-64 rounded-full border border-emerald-400/10" />
          <div className="absolute -right-12 top-32 h-48 w-48 rounded-full border border-emerald-400/10" />

          <Link to="/" className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400 text-[#07110d] shadow-lg shadow-emerald-400/20">
              <FiCpu className="text-2xl" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">
                I-COMPUTER
              </h1>
              <p className="mt-0.5 text-xs tracking-[0.2em] text-gray-400">
                TECHNOLOGY STORE
              </p>
            </div>
          </Link>

          <div className="relative my-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              YOUR TECH JOURNEY STARTS HERE
            </div>

            <h2 className="max-w-md text-4xl font-bold leading-tight xl:text-5xl">
              Upgrade your
              <span className="mt-2 block text-emerald-400">
                digital world.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
              Create your I-Computer account to explore technology,
              manage your shopping cart, and make your next upgrade
              easier.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Discover your favourite tech products",
                "Keep track of your shopping experience",
                "Enjoy a simple and convenient checkout",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                    <FiArrowRight size={13} />
                  </span>
                  <span className="text-sm text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-2 text-xs text-gray-500">
            <FiShield className="text-emerald-400" />
            Your next upgrade starts with an account.
          </div>
        </section>

        {/* Right: registration form */}
        <section className="p-6 sm:p-10 xl:p-12">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-[#07110d]">
                <FiCpu className="text-2xl" />
              </span>
              <span>
                <span className="block font-bold tracking-wide">
                  I-COMPUTER
                </span>
                <span className="block text-xs tracking-widest text-gray-400">
                  TECHNOLOGY STORE
                </span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Create your account
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Join I-Computer
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Enter your details below to get started.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* First and last name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  First name *
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    autoComplete="given-name"
                    className={inputClass}
                    maxLength={60}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Last name *
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    autoComplete="family-name"
                    className={inputClass}
                    maxLength={60}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email address *
              </label>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputClass}
                  maxLength={150}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>
                Password *
              </label>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className={inputClass}
                  minLength={8}
                  maxLength={128}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-emerald-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Use at least 8 characters for your password.
              </p>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm password *
              </label>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  className={inputClass}
                  minLength={8}
                  maxLength={128}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-emerald-400"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-4 font-bold text-[#07110d] shadow-lg shadow-emerald-400/10 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating your account..." : "Create Account"}
              {!loading && (
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500">
              ALREADY A MEMBER?
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-xs leading-5 text-gray-600">
            By creating an account, you agree to follow the store's
            terms and conditions.
          </p>
        </section>
      </div>
    </main>
  );
}
