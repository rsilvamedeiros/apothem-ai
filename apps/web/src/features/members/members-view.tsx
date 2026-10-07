import { StatusBadge } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { AddMemberForm } from "./components/add-member-form";
import { MemberRowControls } from "./components/member-row-controls";
import type { LoadMembersResult } from "./load-members";
import styles from "./members-view.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type MembersViewProps = {
  result: LoadMembersResult;
  add: Action;
  /** Returns the server action bound to one membership. */
  changeRole: (membershipId: string) => Action;
  revoke: (membershipId: string) => Action;
};

const STATUS_VIEW = {
  active: { label: "Active", tone: "success" },
  invited: { label: "Invited", tone: "info" },
  revoked: { label: "Revoked", tone: "neutral" },
} as const;

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function MembersView({ result, add, changeRole, revoke }: MembersViewProps) {
  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Members</h1>
        <p className={styles.description}>
          People with access to this organization. apothem-api decides which roles you can grant and
          always keeps at least one active owner.
        </p>
      </header>

      {result.kind === "error" ? (
        <div role="alert" className={styles.alert}>
          {result.message}
        </div>
      ) : null}
      {result.kind === "unreachable" ? (
        <div role="alert" className={styles.alert}>
          apothem-api is unreachable. Try again shortly.
        </div>
      ) : null}

      {result.kind === "ok" ? (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Add a member</h2>
            <p className={styles.hint}>The person needs an existing account.</p>
            <AddMemberForm action={add} />
          </section>

          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Manage</th>
              </tr>
            </thead>
            <tbody>
              {result.members.map((member) => {
                const status = STATUS_VIEW[member.status];
                return (
                  <tr key={member.membershipId}>
                    <td>
                      <span className={styles.name}>{member.name}</span>
                      <span className={styles.email}>{member.email}</span>
                    </td>
                    <td>{capitalize(member.role)}</td>
                    <td>
                      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    </td>
                    <td>
                      <MemberRowControls
                        email={member.email}
                        role={member.role}
                        status={member.status}
                        changeRole={changeRole(member.membershipId)}
                        revoke={revoke(member.membershipId)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
}
