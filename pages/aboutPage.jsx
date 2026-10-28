
import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiArrowUpRight,
    FiCpu,
    FiTarget,
    FiEye,
    FiShield,
    FiHeart,
    FiZap,
    FiUsers,
    FiMonitor,
    FiHeadphones,
    FiCheckCircle,
    FiMail,
    FiMapPin,
    FiLayers,
} from "react-icons/fi";

export default function AboutPage() {
    const values = [
        {
            icon: <FiShield size={23} />,
            title: "Trust & Transparency",
            description:
                "We believe customers deserve clear product information, honest communication, and confidence when making a purchase.",
        },
        {
            icon: <FiHeart size={23} />,
            title: "Customer First",
            description:
                "We aim to make technology shopping simple, welcoming, and accessible for beginners and experienced users alike.",
        },
        {
            icon: <FiZap size={23} />,
            title: "Technology & Innovation",
            description:
                "We keep exploring new technology and smarter ways to help customers discover the right products for their needs.",
        },
        {
            icon: <FiUsers size={23} />,
            title: "Community",
            description:
                "We want to help students, gamers, creators, and professionals find technology that supports their goals.",
        },
    ];

    const highlights = [
        {
            number: "01",
            title: "Discover",
            description:
                "Explore computer components, accessories, and technology products in one place.",
            icon: <FiSearchIcon />,
        },
        {
            number: "02",
            title: "Choose",
            description:
                "Review product details and compare options before deciding what suits you.",
            icon: <FiLayers size={22} />,
        },
        {
            number: "03",
            title: "Upgrade",
            description:
                "Find the technology you need to build, improve, or personalize your setup.",
            icon: <FiMonitor size={22} />,
        },
    ];

    return (
        <main className="min-h-screen overflow-hidden bg-[#080d17] text-white">

            {/* HERO */}
            <section className="relative isolate border-b border-white/[0.06]">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-400/[0.09] blur-[120px]" />
                    <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-cyan-400/[0.06] blur-[130px]" />

                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                            backgroundSize: "48px 48px",
                        }}
                    />
                </div>

                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-12 lg:py-28">

                    {/* Intro text */}
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2">
                            <FiCpu className="text-emerald-300" size={15} />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300 sm:text-xs">
                                Get to know I-Computer
                            </span>
                        </div>

                        <h1 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">
                            Technology for
                            <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                your next move.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
                            Welcome to I-Computer, your destination for
                            computer hardware, accessories, and everyday
                            technology. We aim to make finding the right
                            technology easier, clearer, and more enjoyable.
                        </p>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                            Whether you're building your first PC, upgrading
                            your gaming setup, or looking for tools to support
                            your studies and work, we're here to help you
                            explore your options.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-4 text-sm font-bold text-[#06110e] shadow-[0_0_30px_rgba(52,211,153,0.12)] transition duration-300 hover:-translate-y-1 hover:bg-emerald-300"
                            >
                                Explore Products
                                <FiArrowUpRight size={18} />
                            </Link>

                            <Link
                                to="/contacts"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-gray-200 transition hover:border-emerald-400/30 hover:bg-white/[0.06]"
                            >
                                Contact Our Team
                                <FiArrowRight size={17} />
                            </Link>
                        </div>

                        <div className="mt-8 flex items-center gap-3 text-xs text-gray-500 sm:text-sm">
                            <span className="h-px w-8 bg-emerald-400/60" />
                            Discover technology. Find your next upgrade.
                        </div>
                    </div>

                    {/* Futuristic visual */}
                    <div className="relative mx-auto flex min-h-[330px] w-full max-w-[460px] items-center justify-center sm:min-h-[430px]">

                        <div className="absolute h-64 w-64 rounded-full bg-emerald-400/10 blur-[90px] sm:h-80 sm:w-80" />

                        <div className="absolute h-[270px] w-[270px] rounded-full border border-emerald-300/20 [transform:rotateX(65deg)_rotateZ(-25deg)] sm:h-[350px] sm:w-[350px]" />

                        <div className="absolute h-[310px] w-[310px] rounded-full border border-cyan-300/15 [transform:rotateX(65deg)_rotateZ(35deg)] sm:h-[410px] sm:w-[410px]" />

                        <div className="absolute left-[12%] top-[20%] h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_5px_rgba(103,232,249,0.35)]" />

                        <div className="absolute bottom-[18%] right-[15%] h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_20px_5px_rgba(110,231,183,0.4)]" />

                        {/* Floating central panel */}
                        <div className="relative z-10 w-[260px] rounded-[30px] border border-white/15 bg-gradient-to-br from-[#203747] via-[#111f2c] to-[#080d17] p-5 shadow-[20px_30px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] [transform:perspective(1000px)_rotateY(-8deg)_rotateX(4deg)] transition duration-500 hover:[transform:perspective(1000px)_rotateY(0deg)_rotateX(0deg)] sm:w-[320px] sm:p-7">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                                        I-COMPUTER
                                    </p>
                                    <p className="mt-1 text-xs font-bold tracking-widest">
                                        TECHNOLOGY HUB
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                                    <FiCpu size={24} />
                                </div>
                            </div>

                            <div className="relative my-8 flex aspect-square items-center justify-center">
                                <div className="absolute h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl" />

                                <div className="relative flex h-36 w-36 rotate-[-8deg] items-center justify-center rounded-[28px] border border-emerald-300/40 bg-gradient-to-br from-[#244d4b] via-[#102c30] to-[#071116] shadow-[12px_16px_0_#070e15,0_0_35px_rgba(52,211,153,0.15)] sm:h-44 sm:w-44">
                                    <div className="absolute inset-3 rounded-[20px] border border-emerald-200/20" />

                                    <div className="flex flex-col items-center">
                                        <FiCpu
                                            size={54}
                                            className="text-emerald-300 drop-shadow-[0_0_12px_rgba(110,231,183,0.5)]"
                                        />
                                        <p className="mt-4 text-[9px] font-black tracking-[0.3em] text-emerald-200">
                                            INNOVATE
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-gray-500">
                                        Our philosophy
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-white">
                                        Technology with purpose.
                                    </p>
                                </div>

                                <div className="flex gap-1.5">
                                    <span className="h-1.5 w-5 rounded-full bg-emerald-300" />
                                    <span className="h-1.5 w-3 rounded-full bg-cyan-300/60" />
                                    <span className="h-1.5 w-2 rounded-full bg-white/20" />
                                </div>
                            </div>
                        </div>

                        {/* Floating labels */}
                        <div className="absolute right-0 top-[22%] z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-[#101827]/95 px-3 py-2.5 shadow-xl backdrop-blur-xl sm:-right-2 sm:gap-3 sm:px-4">
                            <FiZap className="text-emerald-300" size={18} />
                            <span className="text-[10px] font-semibold text-gray-200 sm:text-xs">
                                Built around technology
                            </span>
                        </div>

                        <div className="absolute bottom-[15%] left-0 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-[#101827]/95 px-3 py-2.5 shadow-xl backdrop-blur-xl sm:-left-2 sm:gap-3 sm:px-4">
                            <FiMonitor className="text-cyan-300" size={18} />
                            <span className="text-[10px] font-semibold text-gray-200 sm:text-xs">
                                Made for your setup
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR STORY */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">

                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                            Our story
                        </p>

                        <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                            More than products.
                            <span className="block text-gray-500">
                                A better tech experience.
                            </span>
                        </h2>
                    </div>

                    <div className="space-y-5 text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
                        <p>
                            I-Computer was created around a simple idea:
                            technology shopping should be easier to understand.
                            Choosing computer components or accessories can
                            sometimes feel complicated, especially when there
                            are so many options available.
                        </p>

                        <p>
                            Our goal is to bring useful technology products
                            together in one convenient place and give customers
                            the information they need to make informed choices.
                        </p>

                        <p>
                            As we grow, we aim to improve our product
                            collection, shopping experience, and customer
                            support while building lasting relationships
                            with our customers.
                        </p>

                        <p className="text-xs leading-6 text-gray-500">
                            Sample company story — replace this text with
                            the real history of your business.
                        </p>
                    </div>
                </div>
            </section>

            {/* MISSION AND VISION */}
            <section className="border-y border-white/[0.06] bg-[#0b121e]">
                <div className="mx-auto grid max-w-7xl gap-5 px-5 py-16 sm:px-8 md:grid-cols-2 lg:px-12 lg:py-20">

                    <div className="group relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-[#112b2b] to-[#101827] p-6 sm:p-9">
                        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl transition group-hover:bg-emerald-400/20" />

                        <div className="relative">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                                <FiTarget size={24} />
                            </div>

                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                                Our mission
                            </p>

                            <h2 className="mt-3 text-2xl font-bold">
                                Make technology easier to access.
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-gray-400">
                                Our mission is to help customers discover
                                suitable computer products and technology
                                accessories through a convenient shopping
                                experience, clear information, and
                                customer-focused service.
                            </p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-[#122633] to-[#101827] p-6 sm:p-9">
                        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/20" />

                        <div className="relative">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                                <FiEye size={24} />
                            </div>

                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                                Our vision
                            </p>

                            <h2 className="mt-3 text-2xl font-bold">
                                Become a trusted technology destination.
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-gray-400">
                                Our vision is to build a trusted destination
                                where students, gamers, professionals, and
                                technology enthusiasts can explore products
                                that support their ambitions and everyday lives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                <div className="mb-10 max-w-2xl">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                        What matters to us
                    </p>

                    <h2 className="text-3xl font-bold sm:text-4xl">
                        The values behind our work.
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
                        These principles guide the experience we want to
                        provide to every customer.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {values.map((value) => (
                        <article
                            key={value.title}
                            className="group rounded-2xl border border-white/[0.07] bg-[#101827] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25 hover:shadow-[0_20px_45px_rgba(0,0,0,0.2)]"
                        >
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300 transition group-hover:scale-105">
                                {value.icon}
                            </div>

                            <h3 className="text-lg font-bold">
                                {value.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-gray-400">
                                {value.description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {/* HOW WE HELP */}
            <section className="border-y border-white/[0.06] bg-[#0b121e]">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

                    <div className="mb-12 text-center">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                            Simple by design
                        </p>

                        <h2 className="text-3xl font-bold sm:text-4xl">
                            Your journey starts here.
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                            Find your way from exploring products to choosing
                            the technology that works for you.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {highlights.map((item, index) => (
                            <div
                                key={item.number}
                                className="relative rounded-2xl border border-white/[0.07] bg-[#101827] p-6 sm:p-7"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300">
                                        {item.icon}
                                    </div>

                                    <span className="text-sm font-semibold tracking-widest text-gray-600">
                                        {item.number}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-gray-400">
                                    {item.description}
                                </p>

                                {index < highlights.length - 1 && (
                                    <div className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#101827] text-emerald-300 md:flex">
                                        <FiArrowRight size={13} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRODUCT CATEGORIES */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
                <div className="grid items-center gap-8 rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#121f2d] to-[#0c1420] p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-12">

                    <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300">
                            <FiMonitor size={24} />
                        </div>

                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Find the right tech for you.
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                            From PC components and gaming equipment to
                            everyday computer accessories, explore the
                            products available in our store.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-4 text-sm font-bold text-[#06110e] transition hover:-translate-y-1 hover:bg-emerald-300"
                    >
                        Browse the store
                        <FiArrowUpRight size={18} />
                    </Link>
                </div>
            </section>

            {/* CONTACT CTA */}
            <section className="px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-[#102a29] via-[#101b28] to-[#0b1320] px-6 py-12 text-center sm:px-12 sm:py-16">

                    <div className="pointer-events-none absolute -left-16 -top-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-[90px]" />

                    <div className="relative">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                            <FiHeadphones size={26} />
                        </div>

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            We're here to help
                        </p>

                        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                            Have a question about your next upgrade?
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                            Get in touch with us for questions about our
                            products, your shopping experience, or other
                            enquiries.
                        </p>

                        <Link
                            to="/contacts"
                            className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-4 text-sm font-bold text-[#06110e] transition hover:-translate-y-1 hover:bg-emerald-300"
                        >
                            Contact Us
                            <FiArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/[0.06] px-5 py-6 sm:px-8 lg:px-12">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                    <Link
                        to="/"
                        className="text-sm font-bold tracking-wider text-white"
                    >
                        I<span className="text-emerald-400">-</span>COMPUTER
                    </Link>

                    <p className="text-xs text-gray-500">
                        Technology for your next move.
                    </p>

                    <Link
                        to="/products"
                        className="text-xs text-gray-400 transition hover:text-emerald-400"
                    >
                        Explore products
                    </Link>
                </div>
            </footer>
        </main>
    );
}

// Small inline icon component for the "Discover" step.
function FiSearchIcon() {
    return <FiCpu size={22} />;
}
