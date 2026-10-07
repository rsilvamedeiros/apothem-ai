import Link from "next/link";
import { CreateAgentForm } from "@/features/agents/components/create-agent-form";
import { createAgentAction } from "@/features/agents/actions";

type NewAgentPageProps = {
  params: Promise<{ organizationId: string; workspaceId: string }>;
};

export default async function NewAgentPage({ params }: NewAgentPageProps) {
  const { organizationId, workspaceId } = await params;
  const action = createAgentAction.bind(null, organizationId, workspaceId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--apothem-space-3)" }}>
      <div>
        <Link href={`/org/${organizationId}/workspace/${workspaceId}/agents`}>← Agents</Link>
        <h1 style={{ fontSize: "1.35rem", fontWeight: 600 }}>New agent</h1>
        <p style={{ color: "var(--apothem-text-muted)", fontSize: "0.9rem" }}>
          Creates an empty draft. Add instructions, then publish an immutable version.
        </p>
      </div>
      <CreateAgentForm action={action} />
    </div>
  );
}
