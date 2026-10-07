"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button, Card } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import type { LoadAccountResult } from "./load-account";
import styles from "./home-view.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type HomeViewProps = {
  result: LoadAccountResult;
  createOrganization: Action;
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function CreateOrganizationForm({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState(action, {});
  // Controlled so a refused submit never wipes what the user typed.
  const [name, setName] = useState("");

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        Organization name
        <input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={200}
          autoComplete="off"
        />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create organization"}
      </Button>
      {state.message ? (
        <p role="alert" className={styles.error}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function HomeView({ result, createOrganization }: HomeViewProps) {
  if (result.kind === "error" || result.kind === "unreachable" || result.kind === "signed_out") {
    const message =
      result.kind === "error"
        ? result.message
        : result.kind === "unreachable"
          ? "apothem-api is unreachable. Try again shortly."
          : "You need to sign in again.";
    return (
      <div role="alert" className={styles.alert}>
        {message}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Your organizations</h1>
        <p className={styles.hint}>
          Signed in as <span className={styles.email}>{result.principal.email}</span>
        </p>
      </header>

      {result.organizations.length === 0 ? (
        <p className={styles.hint}>You don&apos;t belong to any organization yet. Create your first one to get started.</p>
      ) : (
        <ul className={styles.list}>
          {result.organizations.map((organization) => (
            <li key={organization.id}>
              <Link href={`/org/${organization.id}`} className={styles.orgLink}>
                <Card className={styles.orgCard}>
                  <span className={styles.orgName}>{organization.name}</span>
                  <span className={styles.orgMeta}>
                    {organization.slug} · {capitalize(organization.role)}
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Create an organization</h2>
        <CreateOrganizationForm action={createOrganization} />
      </section>
    </div>
  );
}
