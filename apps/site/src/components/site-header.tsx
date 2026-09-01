import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";
import { MobileNav } from "@/components/mobile-nav";

const NAV_LINKS = [
  { href: "/produto", label: "Produto" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/seguranca", label: "Segurança" },
  { href: "/precos", label: "Preços" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
          <LogoMark className="h-6 w-6 text-accent" />
          APOTHEM AI
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-text-muted sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-text">
              {link.label}
            </Link>
          ))}
          <span className="cursor-default opacity-60">Docs</span>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/contato"
            className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-accent to-info px-4 py-2 text-sm font-semibold text-on-accent shadow-[0_0_0_0_var(--apothem-accent)] transition-all hover:shadow-[0_0_20px_-2px_var(--apothem-accent)] sm:inline-flex"
          >
            Solicitar demonstração
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
