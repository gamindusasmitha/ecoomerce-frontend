
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiMessageCircle,
  FiSend,
  FiHeadphones,
  FiInstagram,
  FiFacebook,
  FiGithub,
  FiCheckCircle,
  FiCpu,
  FiZap,
  FiPhoneCall,
} from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [status, setStatus] = useState("");

  const contactDetails = [
    {
      icon: FiMail,
      label: "Email us",
      value: "support@icomputer.lk",
      description: "For orders, products, and general inquiries.",
      href: "mailto:support@icomputer.lk",
    },
    {
      icon: FiPhone,
      label: "Call us",
      value: "+94 77 123 4567",
      description: "Talk to our customer support team.",
      href: "tel:+94771234567",
    },
    {
      icon: FiMapPin,
      label: "Visit our store",
      value: "Colombo, Sri Lanka",
      description: "Our sample store location.",
      href: "https://www.google.com/maps/search/?api=1&query=Colombo%2C%20Sri%20Lanka",
    },
  ];

  const businessHours = [
    { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { day: "Saturday", time: "9:00 AM – 4:00 PM" },
    { day: "Sunday", time: "Closed" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setStatus("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Demo behavior only.
    // Connect this handler to your backend to send real messages.
    setStatus(
      "Your form is ready! Connect the contact API to send your message to our team."
    );
  };

  const inputClasses =
    "w-full rounded-xl border border-white/10 bg-[#080d17]/80 px-4 py-3.5 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10";

  return (
    <main className="min-h-screen overflow-hidden bg-[#080d17] text-slate-200">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-400/[0.07] blur-[120px]" />
        <div className="absolute right-0 top-[35%] h-80 w-80 rounded-full bg-cyan-400/[0.05] blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Hero section */}
        <section className="relative py-16 sm:py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-semibold tracking-wide text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                WE'RE HERE TO HELP
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
                Let's talk
                <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                  technology.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                Have a question about a product, an order, or finding the right
                setup? Our team is here to help you make the right connection.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#contact-form"
                  className="group inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-bold text-[#07120f] shadow-lg shadow-emerald-400/10 transition duration-300 hover:-translate-y-1 hover:bg-emerald-300"
                >
                  Send us a message
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </a>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-white transition duration-300 hover:border-emerald-400/30 hover:bg-white/[0.06]"
                >
                  Explore products
                  <FiArrowUpRight />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-400" />
                  Friendly support
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-400" />
                  Product guidance
                </span>
              </div>
            </div>

            {/* Decorative tech illustration */}
            <div className="relative mx-auto w-full max-w-md [perspective:1000px]">
              <div className="absolute inset-10 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.015] p-5 shadow-2xl shadow-black/30 sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xl text-emerald-300">
                      <FiCpu />
                    </div>
                    <div>
                      <p className="font-bold text-white">I-Computer</p>
                      <p className="text-xs text-slate-500">
                        Your technology partner
                      </p>
                    </div>
                  </div>

                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
                </div>

                <div className="flex min-h-64 items-center justify-center py-8">
                  <div className="relative flex h-48 w-48 items-center justify-center">
                    <div className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-emerald-400/30" />
                    <div className="absolute inset-4 rounded-full border border-cyan-300/20" />
                    <div className="absolute inset-8 rounded-full bg-emerald-400/[0.06] blur-md" />

                    <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl border border-emerald-300/40 bg-gradient-to-br from-emerald-300/20 to-cyan-400/5 shadow-[0_0_45px_rgba(52,211,153,0.12)] [transform:rotateX(12deg)_rotateY(-12deg)]">
                      <div className="absolute inset-2 rounded-xl border border-white/10" />
                      <FiZap className="text-5xl text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                    </div>

                    <div className="absolute right-1 top-7 h-3 w-3 rounded-sm bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.7)]" />
                    <div className="absolute bottom-5 left-0 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <FiMessageCircle className="mb-3 text-xl text-emerald-300" />
                    <p className="text-sm font-semibold text-white">
                      Need assistance?
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      We're happy to help.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <FiHeadphones className="mb-3 text-xl text-cyan-300" />
                    <p className="text-sm font-semibold text-white">
                      Customer care
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      We're here to listen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 top-16 hidden rounded-xl border border-emerald-400/20 bg-[#101827] px-4 py-3 shadow-xl sm:block">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <FiZap />
                  TECH SUPPORT
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact information */}
        <section className="pb-20">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-[0.25em] text-emerald-300">
              GET IN TOUCH
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              We'd love to hear from you.
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-400">
              Choose the easiest way to reach us. Replace the sample details
              below with your actual business information.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {contactDetails.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={
                    item.label === "Visit our store" ? "_blank" : undefined
                  }
                  rel={
                    item.label === "Visit our store"
                      ? "noreferrer"
                      : undefined
                  }
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-emerald-400/[0.035]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xl text-emerald-300 transition group-hover:bg-emerald-400/15">
                    <Icon />
                  </div>

                  <h3 className="font-bold text-white">{item.label}</h3>
                  <p className="mt-2 break-words text-emerald-300">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-300">
                    Contact us
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Contact form and business hours */}
        <section
          id="contact-form"
          className="grid scroll-mt-10 gap-8 pb-20 lg:grid-cols-[1.15fr_0.85fr]"
        >
          {/* Message form */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#101827] to-[#0b1220] p-6 shadow-2xl shadow-black/20 sm:p-9">
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-xl text-emerald-300">
                <FiSend />
              </div>

              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Send us a message
              </h2>
              <p className="mt-3 leading-7 text-slate-400">
                Fill in the details below and tell us how we can help.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Your name <span className="text-emerald-300">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email address{" "}
                    <span className="text-emerald-300">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option>General Inquiry</option>
                  <option>Product Information</option>
                  <option>Order and Delivery</option>
                  <option>Payment Issue</option>
                  <option>Warranty and Returns</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Your message{" "}
                  <span className="text-emerald-300">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tell us what you need help with..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClasses} resize-y`}
                  required
                />
              </div>

              {status && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4 text-sm leading-6 text-emerald-200"
                >
                  {status}
                </div>
              )}

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-4 font-bold text-[#07120f] transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-[#101827]"
              >
                Send message
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-center text-xs leading-5 text-slate-500">
                This is a demo form. Connect your backend API to receive
                customer messages.
              </p>
            </form>
          </div>

          {/* Hours and extra support */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-300">
                  <FiClock />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    Business hours
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Sample opening times
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {businessHours.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-col gap-1 border-b border-white/[0.06] pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm text-slate-400">
                      {item.day}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
                <p className="text-sm leading-6 text-slate-400">
                  Need help outside these hours? Send us a message and we can
                  respond during our next working period.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-[#101827] to-cyan-400/[0.04] p-6 sm:p-8">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-400/[0.08] blur-2xl" />

              <div className="relative">
                <FiHeadphones className="mb-5 text-3xl text-emerald-300" />

                <h3 className="text-xl font-bold text-white">
                  Need product advice?
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Not sure which computer, component, or accessory is right
                  for you? Explore our products and contact us if you need
                  more information.
                </p>

                <Link
                  to="/products"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  Browse our products
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social media section */}
        <section className="pb-20">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] px-6 py-8 text-center sm:flex-row sm:px-10 sm:text-left">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-300">
                STAY CONNECTED
              </p>
              <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                Follow I-Computer
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add your official social media links here.
              </p>
            </div>

            <div className="flex gap-3">
              {[
                {
                  label: "Instagram",
                  icon: FiInstagram,
                  href: "https://www.instagram.com/",
                },
                {
                  label: "Facebook",
                  icon: FiFacebook,
                  href: "https://www.facebook.com/",
                },
                {
                  label: "WhatsApp",
                  icon: FiPhoneCall,
                  href: "https://whatsapp.com/",
                },
              ].map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xl text-slate-300 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pb-20">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/[0.09] via-[#101827] to-cyan-400/[0.06] px-6 py-10 text-center sm:px-10 sm:py-14">
            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-72 -translate-x-1/2 rounded-full bg-emerald-400/[0.08] blur-3xl" />

            <div className="relative">
              <p className="text-xs font-bold tracking-[0.25em] text-emerald-300">
                I-COMPUTER
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-black text-white sm:text-4xl">
                Let's build your next tech setup.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Explore our collection and find the technology that works for
                you.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-bold text-[#07120f] transition hover:-translate-y-1 hover:bg-emerald-300"
              >
                Explore products
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* Simple footer */}
        <footer className="border-t border-white/[0.08] py-7">
          <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
            <p>
              © {new Date().getFullYear()} I-Computer. All rights reserved.
            </p>
            <p>Technology made easier.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
