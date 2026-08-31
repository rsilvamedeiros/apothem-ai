"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@apothem/ui";

/**
 * Interim lead capture: opens a prefilled mailto instead of posting to a
 * backend, because apothem-api has no leads/CRM endpoint yet. Replace with
 * a real submission once one exists.
 */
export function LeadForm({
  subjectPrefix = "Solicitação de demonstração",
  submitLabel = "Solicitar demonstração",
  showMessage = false,
}: {
  subjectPrefix?: string;
  submitLabel?: string;
  showMessage?: boolean;
}) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const company = String(formData.get("company") ?? "");
    const message = String(formData.get("message") ?? "");

    const subject = encodeURIComponent(`${subjectPrefix}: ${company || name}`);
    const body = encodeURIComponent(
      `Nome: ${name}\nE-mail: ${email}\nEmpresa: ${company}\n\nMensagem:\n${message}`,
    );
    window.location.href = `mailto:hello@apothemai.com.br?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-text-muted">
          Nome
          <input
            name="name"
            required
            className="rounded-sm border border-border bg-surface-raised px-3 py-2 text-text focus:border-accent focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-muted">
          Empresa
          <input
            name="company"
            required
            className="rounded-sm border border-border bg-surface-raised px-3 py-2 text-text focus:border-accent focus:outline-none"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm text-text-muted">
        E-mail corporativo
        <input
          name="email"
          type="email"
          required
          className="rounded-sm border border-border bg-surface-raised px-3 py-2 text-text focus:border-accent focus:outline-none"
        />
      </label>
      {showMessage && (
        <label className="flex flex-col gap-1 text-sm text-text-muted">
          Mensagem
          <textarea
            name="message"
            rows={4}
            className="rounded-sm border border-border bg-surface-raised px-3 py-2 text-text focus:border-accent focus:outline-none"
          />
        </label>
      )}
      <Button type="submit">{submitLabel}</Button>
      {submitted && (
        <p className="text-sm text-text-muted">
          Abrimos seu cliente de e-mail com os dados preenchidos. É só enviar.
        </p>
      )}
    </form>
  );
}
