import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-text">APOTHEM AI</span>
          <span>© {new Date().getFullYear()} APOTHEM AI. Todos os direitos reservados.</span>
        </div>
        <nav className="flex flex-wrap gap-6">
          <Link href="/produto" className="transition-colors hover:text-text">
            Produto
          </Link>
          <Link href="/solucoes" className="transition-colors hover:text-text">
            Soluções
          </Link>
          <Link href="/seguranca" className="transition-colors hover:text-text">
            Segurança
          </Link>
          <Link href="/precos" className="transition-colors hover:text-text">
            Preços
          </Link>
          <Link href="/contato" className="transition-colors hover:text-text">
            Contato
          </Link>
        </nav>
      </div>
    </footer>
  );
}
