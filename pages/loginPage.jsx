
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
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            if (loading) return;

            try {
                setLoading(true);

                const res = await axios.post(
                    `${API_URL}/users/google-login`,
                    { accessToken: response.access_token }
                );

                if (!res.data?.token) {
                    toast.error("Google login failed. Please try again.");
                    return;
                }

                localStorage.setItem("token", res.data.token);
                toast.success("Login successful. Welcome back!");

                if (res.data.role === "admin") {
                    navigate("/admin", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            } catch (err) {
                console.error("Google login error:", err);
                toast.error(
                    err.response?.data?.message || "Google login failed."
                );
            } finally {
                setLoading(false);
            }
        },
        onError: () => toast.error("Google login failed."),
        onNonOAuthError: () => toast.error("Google login failed."),
    });

    async function login(event) {
        event.preventDefault();

        if (loading) return;

        if (!email.trim() || !password) {
            toast.error("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(`${API_URL}/users/login`, {
                email: email.trim().toLowerCase(),
                password,
            });

            if (!res.data?.token) {
                toast.error(
                    res.data?.message || "Invalid login credentials."
                );
                return;
            }

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
                    "Login failed. Please check your details."
            );
        } finally {
            setLoading(false);
        }
    }

    const inputClass =
        "w-full rounded-xl border border-white/10 bg-[#080d17]/80 py-3 pl-11 pr-11 text-sm text-white outline-none transition duration-300 placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10";

    return (
        <main className="relative flex min-h-dvh items-center justify-center overflow-x-hidden bg-[#080d17] px-3 py-4 text-white sm:px-5 lg:h-dvh lg:min-h-0 lg:overflow-hidden lg:py-3">
            {/* Background effects */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-[110px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

            {/* Background grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                }}
            />

            {/* Main layout */}
            <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#101827]/95 shadow-2xl shadow-black/50 animate-[fadeIn_0.5s_ease-out] lg:h-full lg:max-h-[790px] lg:grid-cols-2">
                {/* Left branding section */}
                <section className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#10251f] via-[#101827] to-[#080d17] p-7 lg:flex xl:p-9">
                    <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-emerald-400/10" />
                    <div className="pointer-events-none absolute -right-10 top-32 h-48 w-48 rounded-full border border-emerald-400/15" />

                    <Link to="/" className="relative flex w-fit items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-[#07110d] shadow-lg shadow-emerald-400/20">
                            <FiCpu className="text-2xl" />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-[0.12em]">
                                I-COMPUTER
                            </h1>
                            <p className="mt-0.5 text-[10px] tracking-[0.3em] text-gray-400">
                                TECHNOLOGY STORE
                            </p>
                        </div>
                    </Link>

                    <div className="relative my-6">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-medium tracking-wide text-emerald-400">
                            <FiZap className="animate-pulse" />
                            POWER YOUR NEXT MOVE
                        </div>

                        <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
                            Technology
                            <span className="mt-1 block text-emerald-400">
                                meets performance.
                            </span>
                        </h2>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
                            Your next upgrade starts here. Sign in to explore
                            your favourite technology and continue shopping.
                        </p>

                        <div className="mt-7 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-emerald-400/30">
                                <FiCpu className="mb-2 text-xl text-emerald-400" />
                                <p className="text-sm font-semibold">
                                    Latest Technology
                                </p>
                                <p className="mt-1 text-xs leading-4 text-gray-500">
                                    Find your next upgrade.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-emerald-400/30">
                                <FiShield className="mb-2 text-xl text-emerald-400" />
                                <p className="text-sm font-semibold">
                                    Your Account
                                </p>
                                <p className="mt-1 text-xs leading-4 text-gray-500">
                                    Your shopping, all in one place.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="relative text-[10px] tracking-[0.2em] text-gray-500">
                        PLUG IN. POWER UP. PLAY HARD.
                    </p>
                </section>

                {/* Right login section */}
                <section className="flex items-center justify-center p-5 sm:p-7 lg:min-h-0 lg:p-6 xl:p-8">
                    <div className="w-full max-w-sm">
                        {/* Mobile logo */}
                        <div className="mb-6 lg:hidden">
                            <Link to="/" className="inline-flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#07110d]">
                                    <FiCpu className="text-xl" />
                                </div>

                                <div>
                                    <p className="font-bold tracking-wider">
                                        I-COMPUTER
                                    </p>
                                    <p className="mt-0.5 text-[10px] tracking-[0.2em] text-gray-400">
                                        TECHNOLOGY STORE
                                    </p>
                                </div>
                            </Link>
                        </div>

                        {/* Heading */}
                        <div className="mb-5">
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
                                Welcome back
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Sign in to your
                                <span className="block">account.</span>
                            </h2>

                            <p className="mt-2 text-sm leading-5 text-gray-400">
                                Enter your credentials to continue to I-Computer.
                            </p>
                        </div>

                        {/* Login form */}
                        <form onSubmit={login} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="login-email"
                                    className="mb-1.5 block text-sm font-medium text-gray-300"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                                    <input
                                        id="login-email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className={inputClass}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password + forgot password */}
                            <div>
                                <div className="mb-1.5 flex items-center justify-between gap-3">
                                    <label
                                        htmlFor="login-password"
                                        className="text-sm font-medium text-gray-300"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        to="/forget-password"
                                        className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className={inputClass}
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((current) => !current)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-emerald-400"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Sign in */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-bold text-[#07110d] shadow-lg shadow-emerald-400/10 transition duration-300 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Signing you in..." : "Sign In"}
                                {!loading && (
                                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                )}
                            </button>

                            {/* Google sign in */}
                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-gray-200 transition duration-300 hover:border-emerald-400/30 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <GrGoogle className="text-base" />
                                Continue with Google
                            </button>
                        </form>

                        {/* Register */}
                        <div className="my-5 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-[10px] tracking-[0.15em] text-gray-500">
                                NEW TO I-COMPUTER?
                            </span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center transition hover:border-emerald-400/20">
                            <p className="text-sm text-gray-400">
                                Don't have an account yet?
                            </p>

                            <Link
                                to="/register"
                                className="mt-1.5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
                            >
                                Create an account
                                <FiArrowRight />
                            </Link>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500">
                            <FiShield className="text-emerald-400" />
                            Secure sign-in to your account
                        </div>

                        <p className="mt-3 text-center text-[10px] text-gray-600">
                            © {new Date().getFullYear()} I-Computer. All rights reserved.
                        </p>
                    </div>
                </section>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
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
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </main>
    );
}
