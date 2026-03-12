import Link from "next/link";
import {
  Smartphone,
  QrCode,
  RefreshCw,
  ShoppingBag,
  Calendar,
  BarChart3,
  MessageCircle,
  Instagram,
  MapPin,
  ExternalLink,
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Beautiful on any phone",
    description:
      "Mobile-first design that looks stunning on every device. Your menu is always just a tap away.",
  },
  {
    icon: QrCode,
    title: "Share with a QR code",
    description:
      "Get a branded QR code that matches your restaurant\u2019s style. Print it on table cards, windows, or receipts.",
  },
  {
    icon: ShoppingBag,
    title: "Order delivery",
    description:
      "Link directly to Uber Eats, Wolt, and other delivery platforms. One tap to order.",
  },
  {
    icon: Calendar,
    title: "Book a table",
    description:
      "Let customers reserve a table with one tap. No phone calls, no waiting.",
  },
  {
    icon: BarChart3,
    title: "Track your menu",
    description:
      "See how many people view your menu, click your links, and engage with your content.",
  },
  {
    icon: RefreshCw,
    title: "Update instantly",
    description:
      "Change prices, add specials, toggle availability \u2014 all changes are instant. No app to download.",
  },
];

const demoLinks = [
  {
    icon: MessageCircle,
    label: "Chat on WhatsApp",
    href: "https://wa.me/27612345678",
    color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Instagram,
    label: "Follow on Instagram",
    href: "https://instagram.com/theyardcpt",
    color: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: MapPin,
    label: "Get Directions",
    href: "https://www.google.com/maps/search/?api=1&query=12+Kloof+Street+Gardens+Cape+Town",
    color: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
    iconColor: "text-teal-600",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* \u2500\u2500 Navbar \u2500\u2500 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-extrabold text-foreground tracking-tight">
            MenuMaker
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/menu/demo-the-yard"
              className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View Demo
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-full hover:bg-[#d4654f] transition-all duration-200 shadow-warm-sm hover:shadow-warm active:scale-[0.98]"
            >
              Create your menu
            </Link>
          </div>
        </nav>
      </header>

      {/* \u2500\u2500 Hero section \u2500\u2500 */}
      <section className="bg-section-tint flex flex-col items-center text-center px-6 pt-24 pb-20 md:pt-36 md:pb-32">
        <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] max-w-3xl">
          Your restaurant menu, online in 5&nbsp;minutes
        </h1>
        <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed mx-auto">
          Create a beautiful, mobile-friendly menu. Share it with a QR code.
          Update it anytime.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link
            href="/create"
            className="inline-flex items-center px-10 py-4 text-lg font-bold text-primary-foreground bg-primary rounded-full hover:bg-[#d4654f] transition-all duration-200 shadow-warm-lg active:scale-[0.98]"
          >
            Create your menu &mdash; it&apos;s free
          </Link>
          <Link
            href="/menu/demo-the-yard"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground decoration-primary/40 transition-colors underline underline-offset-4"
          >
            See a live demo
          </Link>
        </div>
        </div>
      </section>

      {/* \u2500\u2500 Phone mockup section \u2500\u2500 */}
      <section className="bg-white flex justify-center px-6 pb-20 md:pb-28">
        <div className="rounded-[2.5rem] border-[6px] border-gray-900 shadow-warm-lg max-w-xs mx-auto aspect-[9/16] overflow-hidden bg-orange-50 flex flex-col">
          {/* Notch */}
          <div className="flex justify-center bg-gray-800 pt-2 pb-1">
            <div className="w-20 h-4 bg-gray-800 rounded-b-xl" />
          </div>

          {/* Mock hero area */}
          <div className="bg-emerald-800 text-white px-5 py-8 text-center flex flex-col items-center gap-2 relative">
            {/* Open now badge */}
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-400 text-white shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Open now
              </span>
            </div>

            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
              TY
            </div>
            <h3 className="text-xl font-bold" style={{ fontFamily: "serif" }}>
              The Yard
            </h3>
            <p className="text-xs text-white/70">
              Wood-fired flavours, neighbourhood vibes
            </p>

            {/* Quick-action icons */}
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center" title="WhatsApp">
                <MessageCircle className="w-4 h-4 text-white/80" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center" title="Instagram">
                <Instagram className="w-4 h-4 text-white/80" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center" title="Directions">
                <MapPin className="w-4 h-4 text-white/80" />
              </div>
            </div>
          </div>

          {/* Delivery button pills */}
          <div className="flex gap-1.5 px-4 py-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-medium rounded-full bg-gray-900 text-white">
              <ShoppingBag className="w-2.5 h-2.5" />
              Uber Eats
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-medium rounded-full bg-cyan-500 text-white">
              <ShoppingBag className="w-2.5 h-2.5" />
              Wolt
            </span>
          </div>

          {/* Mock category pills */}
          <div className="flex gap-1.5 px-4 py-2 overflow-hidden">
            {["Chef\u2019s Specials", "Starters", "Mains", "Drinks", "Desserts"].map(
              (label) => (
                <span
                  key={label}
                  className="flex-shrink-0 px-3 py-1 text-[10px] font-medium rounded-full border border-gray-300 text-gray-600 whitespace-nowrap"
                >
                  {label}
                </span>
              )
            )}
          </div>

          {/* Mock menu items */}
          <div className="flex-1 px-4 py-2 flex flex-col gap-2">
            {[
              { name: "Braai Board for Two", price: "R345" },
              { name: "The Yard Burger", price: "R155" },
              { name: "Malva Pudding", price: "R75" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between py-2 border-b border-gray-200/60 last:border-0"
              >
                <div>
                  <p className="text-xs font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Chef&apos;s description
                  </p>
                </div>
                <span className="text-xs font-semibold text-orange-600 flex-shrink-0 ml-2">
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex justify-center bg-gray-800 py-2">
            <div className="w-20 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* \u2500\u2500 Features section \u2500\u2500 */}
      <section className="bg-section-warm py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground text-center mb-4">
            Everything your menu needs
          </h2>
          <p className="text-muted-foreground text-lg text-center max-w-xl mx-auto mb-16">
            Built for restaurants, cafes, and food trucks. No app required.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-8 shadow-warm-sm hover-lift flex flex-col items-start text-left"
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* \u2500\u2500 See the demo section \u2500\u2500 */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            See what your customers see
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-14">
            Every MenuMaker menu comes with interactive links. Here\u2019s what The Yard\u2019s customers can do with one tap.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {demoLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-3 p-8 rounded-2xl border-2 hover-lift transition-colors ${link.color}`}
                >
                  <Icon className={`w-8 h-8 ${link.iconColor}`} />
                  <span className="text-base font-bold">{link.label}</span>
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </a>
              );
            })}
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            These are real, interactive links from The Yard\u2019s demo menu &mdash; proving the product works.
          </p>
        </div>
      </section>

      {/* \u2500\u2500 Final CTA \u2500\u2500 */}
      <section className="relative bg-[#1a1625] overflow-hidden py-24 md:py-32 px-6">
        {/* Subtle gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1625] via-[#1e1a2a] to-[#1a1625]" />

        <div className="relative max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              One tool, endless styles
            </h2>
            <p className="text-lg text-gray-400 max-w-lg mx-auto">
              From casual brunch spots to fine dining &mdash; your menu matches your brand.
            </p>
          </div>

          {/* 3 phone mockups showing different themes */}
          <div className="flex items-end justify-center gap-6 md:gap-10 mb-16 md:mb-20">
            {/* Mockup 1: Funky & Bold (left, slightly shorter) */}
            <div className="hidden sm:flex rounded-[1.8rem] border-[4px] border-gray-700/60 shadow-2xl w-44 md:w-52 aspect-[9/16] overflow-hidden flex-col mb-4">
              <div className="flex justify-center bg-[#0F0A1A] pt-1.5 pb-0.5">
                <div className="w-12 h-2.5 bg-gray-900 rounded-b-lg" />
              </div>
              <div className="bg-[#1A1230] text-[#F5F0FF] px-4 py-5 text-center flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[#E040FB]/20 flex items-center justify-center text-xs font-bold text-[#E040FB]">NR</div>
                <h3 className="text-sm font-bold" style={{ fontFamily: "Impact, Arial Black, sans-serif" }}>Neon Ramen</h3>
                <p className="text-[9px] text-[#7B6A9E]">Late-night bowls &amp; cocktails</p>
              </div>
              <div className="bg-[#0F0A1A] flex gap-1 px-3 py-1.5 overflow-hidden">
                {["Bowls", "Sides", "Drinks"].map((c) => (
                  <span key={c} className="flex-shrink-0 px-2 py-0.5 text-[8px] font-medium rounded-full border border-[#2D2450] text-[#C4B8E0] whitespace-nowrap">{c}</span>
                ))}
              </div>
              <div className="flex-1 bg-[#0F0A1A] px-3 py-2 flex flex-col gap-1.5">
                {[
                  { name: "Spicy Miso Ramen", price: "R165" },
                  { name: "Gyoza (6pc)", price: "R85" },
                  { name: "Matcha Highball", price: "R75" },
                ].map((item) => (
                  <div key={item.name} className="flex items-start justify-between py-1 border-b border-[#2D2450]/50 last:border-0">
                    <p className="text-[9px] font-medium text-[#F5F0FF]">{item.name}</p>
                    <span className="text-[9px] font-semibold text-[#E040FB] flex-shrink-0 ml-1">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center bg-[#0F0A1A] py-1.5">
                <div className="w-12 h-0.5 bg-gray-700 rounded-full" />
              </div>
            </div>

            {/* Mockup 2: Classic & Timeless (center, largest) */}
            <div className="flex rounded-[2rem] border-[5px] border-gray-700/60 shadow-2xl w-52 md:w-64 aspect-[9/16] overflow-hidden flex-col ring-1 ring-white/10">
              <div className="flex justify-center bg-[#F8F5EE] pt-2 pb-0.5">
                <div className="w-14 h-3 bg-gray-900 rounded-b-lg" />
              </div>
              <div className="bg-[#6B4F10] text-white px-4 py-6 text-center flex flex-col items-center gap-1.5">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">LB</div>
                <h3 className="text-base font-bold" style={{ fontFamily: "Georgia, serif" }}>Le Bistrot</h3>
                <p className="text-[9px] text-white/60">French comfort, Cape Town soul</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-white/70" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-white/70" />
                  </div>
                </div>
              </div>
              <div className="bg-[#F8F5EE] flex gap-1 px-3 py-1.5 overflow-hidden">
                {["Entr\u00e9es", "Plats", "Desserts", "Vins"].map((c) => (
                  <span key={c} className="flex-shrink-0 px-2 py-0.5 text-[8px] font-medium rounded-full border border-[#E5DFD0] text-[#6B5D4A] whitespace-nowrap">{c}</span>
                ))}
              </div>
              <div className="flex-1 bg-[#F8F5EE] px-3 py-2 flex flex-col gap-1.5">
                {[
                  { name: "Soupe \u00e0 l'Oignon", price: "R95" },
                  { name: "Coq au Vin", price: "R285" },
                  { name: "Cr\u00e8me Br\u00fbl\u00e9e", price: "R85" },
                  { name: "Tarte Tatin", price: "R95" },
                ].map((item) => (
                  <div key={item.name} className="flex items-start justify-between py-1 border-b border-[#E5DFD0] last:border-0">
                    <p className="text-[9px] font-medium text-[#2C2416]" style={{ fontFamily: "Georgia, serif" }}>{item.name}</p>
                    <span className="text-[9px] font-semibold text-[#8B6914] flex-shrink-0 ml-1">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center bg-[#F8F5EE] py-1.5">
                <div className="w-14 h-0.5 bg-[#E5DFD0] rounded-full" />
              </div>
            </div>

            {/* Mockup 3: Chic & Minimal (right, slightly shorter) */}
            <div className="hidden sm:flex rounded-[1.8rem] border-[4px] border-gray-700/60 shadow-2xl w-44 md:w-52 aspect-[9/16] overflow-hidden flex-col mb-4">
              <div className="flex justify-center bg-white pt-1.5 pb-0.5">
                <div className="w-12 h-2.5 bg-gray-900 rounded-b-lg" />
              </div>
              <div className="bg-[#111111] text-white px-4 py-5 text-center flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">O.</div>
                <h3 className="text-sm font-bold" style={{ fontFamily: "Georgia, serif" }}>Otium</h3>
                <p className="text-[9px] text-white/40">Modern plates, considered wine</p>
              </div>
              <div className="bg-white flex gap-1 px-3 py-1.5 overflow-hidden">
                {["Raw", "Land", "Sea", "Sweet"].map((c) => (
                  <span key={c} className="flex-shrink-0 px-2 py-0.5 text-[8px] font-medium rounded-full border border-[#EBEBEB] text-[#555555] whitespace-nowrap">{c}</span>
                ))}
              </div>
              <div className="flex-1 bg-white px-3 py-2 flex flex-col gap-1.5">
                {[
                  { name: "Tuna Tartare", price: "R145" },
                  { name: "Duck Breast", price: "R295" },
                  { name: "Panna Cotta", price: "R95" },
                ].map((item) => (
                  <div key={item.name} className="flex items-start justify-between py-1 border-b border-[#EBEBEB] last:border-0">
                    <p className="text-[9px] font-medium text-[#111111]" style={{ fontFamily: "Helvetica Neue, Helvetica, sans-serif" }}>{item.name}</p>
                    <span className="text-[9px] font-semibold text-[#111111] flex-shrink-0 ml-1">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center bg-white py-1.5">
                <div className="w-12 h-0.5 bg-[#EBEBEB] rounded-full" />
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/create"
                className="inline-flex items-center px-10 py-4 text-lg font-bold text-primary-foreground bg-primary rounded-full hover:bg-[#d4654f] transition-all duration-200 shadow-lg active:scale-[0.98]"
              >
                Create your free menu
              </Link>
              <Link
                href="/menu/demo-the-yard"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-300 rounded-full border border-gray-600 hover:border-gray-400 hover:text-white transition-all duration-200"
              >
                See a live demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* \u2500\u2500 Footer \u2500\u2500 */}
      <footer className="border-t border-border/50 py-10 text-center">
        <p className="text-sm text-muted-foreground">Made with care by MenuMaker</p>
      </footer>
    </div>
  );
}
