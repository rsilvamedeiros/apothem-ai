"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/produto", label: "Produto" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/seguranca", label: "Segurança" },
  { href: "/precos", label: "Preços" },
  { href: "/contato", label: "Contato" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-border bg-bg px-6 py-4 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-sm px-2 py-2 text-text-muted transition-colors hover:bg-surface hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
