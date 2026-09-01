import Link from "next/link";
import { Mail } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Produto",
    links: [
      { href: "/produto", label: "Produto" },
      { href: "/seguranca", label: "Segurança" },
      { href: "/precos", label: "Preços" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/solucoes", label: "Soluções" },
      { href: "/sobre", label: "Sobre" },
      { href: "/contato", label: "Contato" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
              <LogoMark className="h-6 w-6 text-accent" />
              APOTHEM AI
            </Link>
            <p className="max-w-xs text-sm text-text-muted">
              A camada de inteligência entre o contexto da sua empresa e a ação autorizada.
            </p>
            <a
              href="mailto:hello@apothemai.com.br"
              className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
            >
              <Mail className="h-4 w-4 text-accent" aria-hidden />
              hello@apothemai.com.br
            </a>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-text-subtle">
                {column.title}
              </span>
              <nav className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-text-subtle sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} APOTHEM AI. Todos os direitos reservados.</span>
          <span>Feito no Brasil.</span>
        </div>
      </div>
    </footer>
  );
}
