import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contato | APOTHEM AI",
  description: "Fale com a APOTHEM AI e agende uma demonstração da plataforma.",
};

export default function ContatoPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="flex flex-col gap-6">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Contato
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Vamos conversar sobre o seu caso de uso.
          </h1>
          <p className="max-w-md text-text-muted">
            Conte um pouco sobre sua empresa e o problema que você quer resolver. Respondemos
            por e-mail para agendar uma demonstração.
          </p>
          <div className="flex flex-col gap-3 text-sm text-text-muted">
            <a href="mailto:hello@apothemai.com.br" className="flex items-center gap-2 hover:text-text">
              <Mail className="h-4 w-4 text-accent" aria-hidden />
              hello@apothemai.com.br
            </a>
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-accent" aria-hidden />
              Respondemos em até 1 dia útil
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <LeadForm submitLabel="Enviar" showMessage />
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
