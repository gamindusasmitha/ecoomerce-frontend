import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiCpu,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiZap,
} from "react-icons/fi";

import { GrGoogle } from "react-icons/gr";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      setLoading(true);

      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/users/google-login", {
          accessToken: response.access_token,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          toast.success("Login successful. Welcome back!");

          if (res.data.role == "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("Google login error:", err.response?.data || err);
          toast.error(err.response?.data?.message || "Google login failed");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    onError: () => {
      toast.error("Google login failed");
    },
    onNonOAuthError: () => {
      toast.error("Google login failed");
    },
  });

  // ...the rest of your component (the login function and the return) stays the same

  async function login(event) {
    event.preventDefault();

    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        {
          email: email.trim().toLowerCase(),
          password,
        }
      );

      if (!res.data?.token) {
        toast.error(res.data?.message || "Invalid login credentials.");
        return;
      }

      // Save the token before navigating.
      localStorage.setItem("token", res.data.token);

      toast.success("Welcome back!");

      if (res.data.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);

      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#080d17]/80 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition duration-300 placeholder:text-gray-600 focus:border-emerald-400 focus:bg-[#080d17] focus:ring-4 focus:ring-emerald-400/10";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d17] px-4 py-8 text-white sm:px-6 lg:py-12">

      {/* Animated background glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 animate-pulse rounded-full bg-emerald-400/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 animate-pulse rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Main login layout */}
      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#101827]/95 shadow-2xl shadow-black/50 animate-[fadeIn_0.7s_ease-out] lg:min-h-[650px] lg:grid-cols-2">

        {/* Left branding section */}
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#10251f] via-[#101827] to-[#080d17] p-10 lg:flex xl:p-14">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full border border-emerald-400/10" />
          <div className="pointer-events-none absolute -right-12 top-36 h-56 w-56 rounded-full border border-emerald-400/15" />
          <div className="pointer-events-none absolute right-12 top-48 h-28 w-28 rounded-full border border-emerald-400/20" />

          {/* Logo and brand */}
          <Link to="/" className="relative flex w-fit items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400 text-[#07110d] shadow-lg shadow-emerald-400/20 transition duration-300 hover:rotate-6 hover:scale-105">
              <FiCpu className="text-2xl" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-[0.12em]">
                I-COMPUTER
              </h1>
              <p className="mt-1 text-[10px] tracking-[0.3em] text-gray-400">
                TECHNOLOGY STORE
              </p>
            </div>
          </Link>

          {/* Hero content */}
          <div className="relative my-12">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs font-medium tracking-wide text-emerald-400">
              <FiZap className="animate-pulse" />
              POWER YOUR NEXT MOVE
            </div>

            <h2 className="max-w-lg text-5xl font-bold leading-[1.15] xl:text-6xl">
              Technology
              <span className="mt-2 block text-emerald-400">
                meets performance.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-gray-400">
              Your next upgrade starts here. Sign in to explore your
              favourite technology and continue your shopping experience.
            </p>

            {/* Feature cards */}
            <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30">
                <FiCpu className="mb-3 text-xl text-emerald-400" />
                <p className="text-sm font-semibold">Latest Technology</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Explore your next upgrade.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30">
                <FiShield className="mb-3 text-xl text-emerald-400" />
                <p className="text-sm font-semibold">Your Account</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Access your store experience.
                </p>
              </div>
            </div>
          </div>

          <p className="relative text-xs tracking-wide text-gray-500">
            PLUG IN. POWER UP. PLAY HARD.
          </p>
        </section>

        {/* Right login section */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-9 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-[#07110d]">
                  <FiCpu className="text-2xl" />
                </div>

                <div>
                  <p className="font-bold tracking-wider">I-COMPUTER</p>
                  <p className="mt-1 text-[10px] tracking-[0.2em] text-gray-400">
                    TECHNOLOGY STORE
                  </p>
                </div>
              </Link>
            </div>

            {/* Form heading */}
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Sign in to your
                <span className="block">account.</span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Enter your credentials to continue to I-Computer.
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={login} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors" />

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={inputClass}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-emerald-400"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-400 px-5 py-4 font-bold text-[#07110d] shadow-lg shadow-emerald-400/10 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Signing you in..." : "Sign In"}
                {!loading && (
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
              <button
                  type="button"
                  onClick={() => googleLogin()}
                  disabled={loading}
                  className="group mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-400 px-5 py-4 font-bold text-[#07110d] shadow-lg shadow-emerald-400/10 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "Signing you in..." : "Sign In through "}
                  {!loading && <GrGoogle />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-500">NEW TO I-COMPUTER?</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Register */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center transition duration-300 hover:border-emerald-400/20">
              <p className="text-sm text-gray-400">
                Don't have an account yet?
              </p>

              <Link
                to="/register"
                className="mt-3 inline-flex items-center gap-2 font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Create an account
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-500">
              <FiShield className="text-emerald-400" />
              Sign in to continue your shopping experience.
            </div>

            <p className="mt-6 text-center text-xs text-gray-600">
              © {new Date().getFullYear()} I-Computer. All rights reserved.
            </p>
          </div>
        </section>
      </div>

      {/* Local animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
