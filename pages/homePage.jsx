

import { useRef } from "react";
import { Route, Routes, Link } from "react-router-dom";
import {
    FiArrowUpRight,
    FiCpu,
    FiShield,
    FiHeadphones,
    FiArrowRight,
    FiZap,
    FiMonitor,
    FiShoppingBag,
    FiCheckCircle,
    FiChevronDown,
    FiActivity,
} from "react-icons/fi";

import Header from "../components/header";
import ProductPage from "./productPage";
import ProductOverview from "./productOverviewPage";
import CartPage from "./cart";
import Checkout from "./checkOutPage";

/* All the 3D and cinematic effects live here, in plain CSS */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,500;0,700;1,700&display=swap');
.ic-font{font-family:'Chakra Petch',ui-sans-serif,system-ui,sans-serif}
@keyframes ic-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes ic-spin{to{transform:rotate(360deg)}}
@keyframes ic-floor{to{background-position:0 64px}}
@keyframes ic-grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-3%,2%)}50%{transform:translate(2%,-3%)}75%{transform:translate(-2%,-1%)}}
@keyframes ic-rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes ic-glitch{0%,90%,100%{transform:translate(0);clip-path:inset(0)}92%{transform:translate(-5px,1px);clip-path:inset(20% 0 55% 0)}95%{transform:translate(5px,-1px);clip-path:inset(60% 0 10% 0)}}
@keyframes ic-rgb{to{background-position:200% 0}}
@keyframes ic-blink{50%{opacity:.25}}
@keyframes ic-sweep{from{transform:translateX(-130%)}to{transform:translateX(330%)}}

.ic-hero{background:radial-gradient(ellipse 55% 50% at 72% 45%,rgba(34,211,238,.16),transparent 70%),radial-gradient(ellipse 80% 45% at 50% 100%,rgba(52,211,153,.22),transparent 70%),#05070d}
.ic-floor{position:absolute;left:-60%;right:-60%;bottom:0;height:52%;background-image:linear-gradient(rgba(52,211,153,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,.4) 1px,transparent 1px);background-size:64px 64px;transform:perspective(420px) rotateX(66deg);transform-origin:50% 100%;animation:ic-floor 2.2s linear infinite;-webkit-mask-image:linear-gradient(to top,#000 15%,transparent 90%);mask-image:linear-gradient(to top,#000 15%,transparent 90%)}
.ic-fx{position:absolute;inset:0;z-index:30;pointer-events:none;overflow:hidden;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.75) 100%),repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 3px)}
.ic-fx::before{content:"";position:absolute;inset:-20%;opacity:.07;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");animation:ic-grain .6s steps(4) infinite}

.ic-glitch{position:relative}
.ic-glitch::before,.ic-glitch::after{content:attr(data-text);position:absolute;left:0;top:0;width:100%;pointer-events:none}
.ic-glitch::before{color:#22d3ee;mix-blend-mode:screen;animation:ic-glitch 4s infinite steps(1)}
.ic-glitch::after{color:#e879f9;mix-blend-mode:screen;animation:ic-glitch 4s infinite steps(1) reverse}

.ic-stage{perspective:1100px}
.ic-float{animation:ic-float 6s ease-in-out infinite}
.ic-gpu{position:relative;width:min(80vw,440px);height:220px;transform-style:preserve-3d;transform:rotateX(calc(16deg + var(--rx,0deg))) rotateY(calc(-26deg + var(--ry,0deg)));transition:transform .15s ease-out}
.ic-gpu-body{position:absolute;inset:0;border-radius:18px;transform-style:preserve-3d;background:linear-gradient(145deg,#22364a,#0a111a 62%);border:1px solid rgba(255,255,255,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 0 70px rgba(52,211,153,.28),18px 22px 0 #060b12}
.ic-fanwrap{position:absolute;top:50%;width:140px;height:140px;margin-top:-70px;transform:translateZ(28px)}
.ic-fanwrap.a{left:28px}
.ic-fanwrap.b{right:28px}
.ic-fan{position:relative;width:100%;height:100%;border-radius:50%;border:6px solid #0b141d;background:repeating-conic-gradient(#07121a 0 14deg,#1a4a42 14deg 28deg);box-shadow:0 0 0 2px rgba(52,211,153,.55),0 0 34px rgba(52,211,153,.4);animation:ic-spin 1.6s linear infinite}
.ic-fanwrap.b .ic-fan{animation-duration:2.2s}
.ic-fan::after{content:"";position:absolute;inset:36%;border-radius:50%;background:#0b1118;border:2px solid #34d399}
.ic-rgb{position:absolute;left:20px;right:20px;bottom:14px;height:5px;border-radius:9px;background:linear-gradient(90deg,#34d399,#22d3ee,#a78bfa,#34d399);background-size:200% 100%;animation:ic-rgb 3s linear infinite;box-shadow:0 0 18px #22d3ee;transform:translateZ(34px)}
.ic-label{position:absolute;left:22px;top:14px;font-size:12px;font-weight:700;letter-spacing:.25em;color:#a7f3d0;transform:translateZ(44px)}
.ic-shadow{width:70%;height:30px;margin:54px auto 0;background:radial-gradient(closest-side,rgba(52,211,153,.4),transparent);filter:blur(8px)}

.ic-in{opacity:0;animation:ic-rise .9s cubic-bezier(.2,.7,.2,1) forwards}
.ic-cut{clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)}
.ic-btn{position:relative;overflow:hidden}
.ic-btn::after{content:"";position:absolute;top:0;bottom:0;left:0;width:35%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.6),transparent);transform:translateX(-130%)}
.ic-btn:hover::after{animation:ic-sweep .8s}
.ic-card{position:relative;overflow:hidden;transition:transform .35s,border-color .35s,box-shadow .35s}
.ic-card:hover{transform:perspective(900px) rotateX(5deg) rotateY(-7deg) translateY(-10px);border-color:var(--c);box-shadow:0 30px 60px rgba(0,0,0,.5),0 0 40px -10px var(--c)}
.ic-card::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.1) 50%,transparent 65%);transform:translateX(-120%);transition:transform .8s}
.ic-card:hover::after{transform:translateX(120%)}
.ic-blink{animation:ic-blink 1.2s steps(2) infinite}

@media (prefers-reduced-motion:reduce){
  .ic-wrap *,.ic-wrap *::before,.ic-wrap *::after{animation:none!important;transition:none!important}
  .ic-in{opacity:1}
}
`;

function HomeLanding() {
    const stageRef = useRef(null);

    // Tilt the 3D graphics card to follow the mouse
    function handleMove(event) {
        const box = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        stageRef.current?.style.setProperty("--ry", `${x * 28}deg`);
        stageRef.current?.style.setProperty("--rx", `${-y * 20}deg`);
    }

    function handleLeave() {
        stageRef.current?.style.setProperty("--ry", "0deg");
        stageRef.current?.style.setProperty("--rx", "0deg");
    }

    return (
        <div className="ic-wrap overflow-hidden bg-[#05070d] text-white">
            <style>{styles}</style>

            {/* ================= CINEMATIC HERO ================= */}
            <section
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                className="ic-hero relative isolate flex min-h-[92vh] items-center overflow-hidden border-b border-emerald-400/20"
            >
                <div className="ic-floor" />

                {/* Letterbox bars, film grain, scanlines and vignette */}
                <div className="absolute inset-x-0 top-0 z-20 h-6 bg-black" />
                <div className="absolute inset-x-0 bottom-0 z-20 h-6 bg-black" />
                <div className="ic-fx" />

                {/* Screen HUD */}
                <div className="absolute left-5 top-10 z-20 hidden items-center gap-2 text-xs font-medium text-emerald-300/80 sm:flex">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    REC, system online
                </div>
                <div className="absolute right-5 top-10 z-20 hidden items-center gap-2 text-xs font-medium text-emerald-300/80 sm:flex">
                    <FiActivity />
                    Loadout ready
                </div>

                <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:px-12">

                    {/* LEFT: headline */}
                    <div className="max-w-2xl">
                        <h1
                            className="ic-font ic-in text-5xl font-bold italic uppercase leading-[1.02] sm:text-6xl lg:text-7xl"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <span className="ic-glitch block text-white" data-text="Power your">
                                Power your
                            </span>
                            <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                                next level.
                            </span>
                        </h1>

                        <p
                            className="ic-in mt-6 max-w-lg text-sm leading-7 text-gray-300 sm:text-base sm:leading-8"
                            style={{ animationDelay: "0.4s" }}
                        >
                            Discover computer components, gaming gear, and
                            everyday tech essentials. Find the right hardware
                            to build your setup your way.
                        </p>

                        <div
                            className="ic-in mt-8 flex flex-col gap-3 sm:flex-row"
                            style={{ animationDelay: "0.6s" }}
                        >
                            <Link
                                to="/products"
                                className="ic-btn ic-cut ic-font group inline-flex items-center justify-center gap-3 bg-emerald-400 px-7 py-4 text-sm font-bold uppercase text-[#04100c] shadow-[0_0_40px_rgba(52,211,153,0.35)] transition hover:bg-emerald-300"
                            >
                                <FiShoppingBag size={18} />
                                Explore products
                                <FiArrowUpRight
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                            </Link>

                            <Link
                                to="/about"
                                className="ic-cut ic-font inline-flex items-center justify-center gap-2 border border-white/20 bg-white/[0.04] px-7 py-4 text-sm font-bold uppercase text-gray-100 transition hover:border-cyan-300/60 hover:bg-white/[0.08]"
                            >
                                Discover I-Computer
                                <FiArrowRight size={17} />
                            </Link>
                        </div>

                        <div
                            className="ic-in mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-gray-300 sm:text-sm"
                            style={{ animationDelay: "0.8s" }}
                        >
                            {["Explore tech", "Compare products", "Shop your way"].map((text) => (
                                <span key={text} className="flex items-center gap-2">
                                    <FiCheckCircle className="text-emerald-400" />
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: 3D graphics card that follows the mouse */}
                    <div
                        className="ic-in relative mx-auto flex w-full max-w-[520px] items-center justify-center py-12"
                        style={{ animationDelay: "0.5s" }}
                    >
                        <div className="absolute h-72 w-72 rounded-full bg-emerald-400/20 blur-[90px]" />

                        <div ref={stageRef} className="ic-stage relative z-10">
                            <div className="ic-float">
                                <div className="ic-gpu">
                                    <div className="ic-gpu-body">
                                        <span className="ic-label ic-font">I-COMPUTER</span>
                                        <div className="ic-fanwrap a"><div className="ic-fan" /></div>
                                        <div className="ic-fanwrap b"><div className="ic-fan" /></div>
                                        <div className="ic-rgb" />
                                    </div>
                                </div>
                            </div>
                            <div className="ic-shadow" />
                        </div>

                        <div
                            className="ic-float absolute right-0 top-6 z-20 flex items-center gap-3 border border-white/10 bg-[#0b1420]/90 px-4 py-3 backdrop-blur-xl"
                            style={{ animationDelay: "-2s" }}
                        >
                            <FiZap className="text-emerald-300" size={20} />
                            <div>
                                <p className="text-xs text-gray-400">Your tech journey</p>
                                <p className="text-sm font-semibold">Starts here</p>
                            </div>
                        </div>

                        <div
                            className="ic-float absolute bottom-2 left-0 z-20 flex items-center gap-3 border border-white/10 bg-[#0b1420]/90 px-4 py-3 backdrop-blur-xl"
                            style={{ animationDelay: "-4s" }}
                        >
                            <FiMonitor className="text-cyan-300" size={20} />
                            <div>
                                <p className="text-xs text-gray-400">Discover</p>
                                <p className="text-sm font-semibold">Your perfect setup</p>
                            </div>
                        </div>
                    </div>
                </div>

                <FiChevronDown className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-emerald-300/70" size={24} />
            </section>

            {/* ================= CATEGORIES ================= */}
            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="ic-font text-3xl font-bold sm:text-4xl">
                            Pick your gear
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
                            Whether you are building a PC or upgrading your
                            setup, start with what you need.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
                    >
                        View all products
                        <FiArrowUpRight size={17} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <CategoryCard
                        title="Computer components"
                        description="Discover the parts for your next PC build."
                        icon={<FiCpu />}
                        color="#34d399"
                    />
                    <CategoryCard
                        title="Gaming and displays"
                        description="Explore gear for work, play, and creativity."
                        icon={<FiMonitor />}
                        color="#22d3ee"
                    />
                    <CategoryCard
                        title="Everyday tech"
                        description="Find useful technology for your daily setup."
                        icon={<FiZap />}
                        color="#a78bfa"
                    />
                </div>
            </section>

            {/* ================= WHY SHOP HERE ================= */}
            <section className="border-y border-white/[0.06] bg-[#070b13]">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
                    <h2 className="ic-font mb-9 text-3xl font-bold sm:text-4xl">
                        Technology, made simpler
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={<FiShoppingBag size={21} />}
                            title="Easy product discovery"
                            description="Browse products and search for the tech that matches your needs."
                        />
                        <FeatureCard
                            icon={<FiShield size={21} />}
                            title="Shop with confidence"
                            description="Review product information before choosing what is right for you."
                        />
                        <FeatureCard
                            icon={<FiHeadphones size={21} />}
                            title="Here for your setup"
                            description="Explore available products and plan your next upgrade."
                        />
                    </div>
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className="px-5 py-20 sm:px-8 lg:px-12">
                <div className="ic-cut relative mx-auto max-w-7xl overflow-hidden border border-emerald-400/30 bg-gradient-to-br from-[#0d2a26] via-[#0b1420] to-[#150d2b] px-6 py-14 sm:px-10 lg:px-14">
                    <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-[90px]" />

                    <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
                        <div className="max-w-2xl">
                            <p className="ic-font ic-blink text-sm font-bold text-emerald-300">
                                ▶ Press start
                            </p>
                            <h2 className="ic-font mt-3 text-3xl font-bold leading-tight sm:text-5xl">
                                Your next setup starts now.
                            </h2>
                            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-400">
                                Explore the collection and find the products
                                that fit your goals.
                            </p>
                        </div>

                        <Link
                            to="/products"
                            className="ic-btn ic-cut ic-font inline-flex shrink-0 items-center justify-center gap-3 bg-emerald-400 px-8 py-4 text-sm font-bold uppercase text-[#04100c] shadow-[0_0_40px_rgba(52,211,153,0.35)] transition hover:bg-emerald-300"
                        >
                            Start shopping
                            <FiArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="border-t border-white/[0.06] px-5 py-6 sm:px-8 lg:px-12">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                    <p className="ic-font text-sm font-bold tracking-wider text-gray-300">
                        I<span className="text-emerald-400">-</span>COMPUTER
                    </p>

                    <p className="text-xs text-gray-500">
                        Find your tech. Build your future.
                    </p>

                    <Link
                        to="/products"
                        className="text-xs text-gray-400 transition hover:text-emerald-400"
                    >
                        Explore products
                    </Link>
                </div>
            </footer>
        </div>
    );
}

function CategoryCard({ title, description, icon, color }) {
    return (
        <Link
            to="/products"
            style={{ "--c": color }}
            className="ic-card ic-cut group block border border-white/10 bg-[#0b111c] p-7"
        >
            <div
                className="flex h-14 w-14 items-center justify-center border text-2xl"
                style={{ color, borderColor: color }}
            >
                {icon}
            </div>

            <h3 className="ic-font mt-8 text-xl font-bold text-white">{title}</h3>

            <p className="mt-2 min-h-12 text-sm leading-6 text-gray-400">
                {description}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color }}>
                Explore collection
                <FiArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
        </Link>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="border-l-2 border-emerald-400/60 bg-white/[0.03] p-6 transition hover:bg-white/[0.06]">
            <div className="mb-4 text-emerald-300">{icon}</div>
            <h3 className="ic-font text-lg font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="min-h-screen w-full bg-[#05070d]">
            <Header />

            <main className="w-full">
                <Routes>
                    <Route path="/" element={<HomeLanding />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route
                        path="/products/overview/:productID"
                        element={<ProductOverview />}
                    />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contacts" element={<ContactPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </div>
    );
}

function AboutPage() {
    return (
        <SimplePage
            eyebrow="About I-Computer"
            title="Technology for your next step."
            description="Explore our computer and technology collection to find products that fit your setup."
            link="/products"
            linkText="Explore products"
        />
    );
}

function ContactPage() {
    return (
        <SimplePage
            eyebrow="Get in touch"
            title="Let's talk technology."
            description="Have a question? Contact our team through the contact details provided by the store."
            link="/products"
            linkText="Browse products"
        />
    );
}

function NotFoundPage() {
    return (
        <SimplePage
            eyebrow="404, page not found"
            title="Looks like you've left the grid."
            description="The page you are looking for doesn't exist or may have moved."
            link="/"
            linkText="Return home"
        />
    );
}

function SimplePage({ eyebrow, title, description, link, linkText }) {
    return (
        <section className="flex min-h-[70vh] items-center justify-center px-5 py-16 text-center text-white">
            <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    {eyebrow}
                </p>

                <h1 className="mt-4 text-3xl font-bold sm:text-5xl">{title}</h1>

                <p className="mt-5 text-sm leading-7 text-gray-400 sm:text-base">
                    {description}
                </p>

                <Link
                    to={link}
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-4 text-sm font-bold text-[#080d17] transition hover:bg-emerald-300"
                >
                    {linkText}
                    <FiArrowRight />
                </Link>
            </div>
        </section>
    );
}