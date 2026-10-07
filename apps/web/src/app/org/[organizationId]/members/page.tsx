import Link from "next/link";
import {
  addMemberAction,
  changeMemberRoleAction,
  revokeMemberAction,
} from "@/features/members/actions";
import { loadMembers } from "@/features/members/load-members";
import { MembersView } from "@/features/members/members-view";
import { getApiClient } from "@/lib/session";

type MembersPageProps = {
  params: Promise<{ organizationId: string }>;
};

export default async function MembersPage({ params }: MembersPageProps) {
  const { organizationId } = await params;
  const client = await getApiClient();
  const result = await loadMembers(client, organizationId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--apothem-space-2)", padding: "var(--apothem-space-3)" }}>
      <Link href={`/org/${organizationId}`}>← Organization</Link>
      <MembersView
        result={result}
        add={addMemberAction.bind(null, organizationId)}
        changeRole={(membershipId) => changeMemberRoleAction.bind(null, organizationId, membershipId)}
        revoke={(membershipId) => revokeMemberAction.bind(null, organizationId, membershipId)}
      />
    </div>
  );
}
