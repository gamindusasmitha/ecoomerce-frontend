
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    FiArrowLeft,
    FiMail,
    FiLock,
    FiShield,
    FiKey,
    FiCheckCircle,
    FiLoader,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";

export default function ForgetPasswordPage() {
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    async function handleSendOTP(e) {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        try {
            setLoading(true);

            // Update this endpoint to match your backend.
            await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/users/send-otp/${encodeURIComponent(
        email.trim().toLowerCase()
    )}`
);

            setOtpSent(true);
            toast.success("OTP sent to your email");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to send OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();

        if (!otp.trim()) {
            toast.error("Please enter the OTP");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must contain at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            // Update this endpoint and payload to match your backend.
            await axios.post(`${API_URL}/users/reset-password`, {
                email: email.trim().toLowerCase(),
                otp: otp.trim(),
                newPassword: password,
            });

            toast.success("Password reset successfully!");
            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Password reset failed. Check your OTP and try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d17] px-4 py-10 text-white">
            {/* Background effects */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-[120px]" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo / Brand */}
                <Link
                    to="/"
                    className="mb-8 flex items-center justify-center gap-3"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
                        <FiShield className="text-2xl text-emerald-400" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-wide">
                            I-Computer
                        </h1>
                        <p className="text-xs tracking-[0.25em] text-emerald-400">
                            PLUG IN. POWER UP.
                        </p>
                    </div>
                </Link>

                {/* Main card */}
                <div className="rounded-3xl border border-white/10 bg-[#0d1422]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                            {otpSent ? (
                                <FiKey className="text-3xl text-emerald-400" />
                            ) : (
                                <FiLock className="text-3xl text-emerald-400" />
                            )}
                        </div>
                    </div>

                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            {otpSent
                                ? "Reset your password"
                                : "Forgot password?"}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            {otpSent
                                ? "Enter the verification code sent to your email and create a new password."
                                : "Don't worry! Enter your registered email address and we'll help you get back into your account."}
                        </p>
                    </div>

                    {!otpSent ? (
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-[#080d17] py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3.5 font-semibold text-[#080d17] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        Send verification code
                                        <FiArrowLeft className="rotate-180" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            {/* Email display */}
                            <div className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
                                <FiCheckCircle className="shrink-0 text-emerald-400" />

                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">
                                        Verification code sent to
                                    </p>
                                    <p className="truncate text-sm text-gray-200">
                                        {email}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setOtpSent(false)}
                                    className="ml-auto shrink-0 text-xs text-emerald-400 hover:text-emerald-300"
                                >
                                    Change
                                </button>
                            </div>

                            <div>
                                <label
                                    htmlFor="otp"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Verification code (OTP)
                                </label>

                                <div className="relative">
                                    <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />

                                    <input
                                        id="otp"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                                        }
                                        placeholder="Enter your OTP"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-[#080d17] py-3.5 pl-12 pr-4 text-sm tracking-widest outline-none transition placeholder:tracking-normal placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    New password
                                </label>

                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 8 characters"
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-[#080d17] py-3.5 pl-12 pr-12 text-sm outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
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
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Confirm new password
                                </label>

                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />

                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter your password"
                                        autoComplete="new-password"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-[#080d17] py-3.5 pl-12 pr-12 text-sm outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-emerald-400"
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3.5 font-semibold text-[#080d17] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="animate-spin" />
                                        Resetting password...
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle />
                                        Reset password
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-7 border-t border-white/10 pt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-emerald-400"
                        >
                            <FiArrowLeft />
                            Back to login
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-600">
                    Secure account recovery · I-Computer
                </p>
            </div>
        </div>
    );
}
