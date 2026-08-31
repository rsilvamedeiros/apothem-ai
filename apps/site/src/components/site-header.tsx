import Link from "next/link";
import { Button } from "@apothem/ui";
import { LogoMark } from "@/components/logo-mark";

const NAV_LINKS = [
  { href: "/produto", label: "Produto" },
  { href: "/solucoes", label: "Soluções" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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
        <Button href="/#demo" variant="secondary" className="text-sm">
          Solicitar demonstração
        </Button>
      </div>
    </header>
  );
}
