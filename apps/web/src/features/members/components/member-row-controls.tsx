"use client";

import { useActionState, useState } from "react";
import { Button } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { useControlledResetKey } from "@/lib/use-controlled-reset-key";
import { MEMBER_ROLES, type MemberRoleName } from "../member-roles";
import styles from "./members.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type MemberRowControlsProps = {
  email: string;
  role: MemberRoleName;
  status: "active" | "invited" | "revoked";
  changeRole: Action;
  revoke: Action;
};

function Message({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p role={state.ok ? "status" : "alert"} className={state.ok ? styles.ok : styles.error}>
      {state.message}
    </p>
  );
}

export function MemberRowControls({ email, role, status, changeRole, revoke }: MemberRowControlsProps) {
  const [roleState, roleAction, changing] = useActionState(changeRole, {});
  const resetKey = useControlledResetKey(roleState);
  const [revokeState, revokeAction, revoking] = useActionState(revoke, {});
  const [selected, setSelected] = useState<string>(role);
  const [confirming, setConfirming] = useState(false);

  // A revoked membership is history; the API refuses edits to it.
  if (status === "revoked") return null;

  return (
    <div>
      <div className={styles.row}>
        <form action={roleAction} className={styles.row}>
          <select
            key={resetKey}
            name="role"
            aria-label={`Role for ${email}`}
            className={styles.roleSelect}
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
          >
            {MEMBER_ROLES.map((value) => (
              <option key={value} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
          <Button type="submit" variant="secondary" disabled={changing || selected === role}>
            Update role
          </Button>
        </form>

        {!confirming ? (
          <Button type="button" variant="secondary" onClick={() => setConfirming(true)}>
            Revoke access
          </Button>
        ) : null}
      </div>

      {confirming ? (
        <form action={revokeAction} className={styles.confirm}>
          <span>{email} will lose access immediately. The membership is kept for history.</span>
          <Button type="submit" disabled={revoking}>
            Confirm revoke
          </Button>
          <Button type="button" variant="secondary" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
        </form>
      ) : null}

      <Message state={roleState} />
      <Message state={revokeState} />
    </div>
  );
}
