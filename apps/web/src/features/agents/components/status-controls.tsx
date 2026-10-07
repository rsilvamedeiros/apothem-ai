"use client";

import { useActionState, useState } from "react";
import { Button } from "@apothem/ui";
import type { AgentStatus } from "../agent-status";
import type { ActionState } from "./action-state";
import styles from "./status-controls.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type StatusControlsProps = {
  status: AgentStatus;
  publish: Action;
  disable: Action;
  archive: Action;
};

function Message({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p role={state.ok ? "status" : "alert"} className={state.ok ? styles.ok : styles.error}>
      {state.message}
    </p>
  );
}

export function StatusControls({ status, publish, disable, archive }: StatusControlsProps) {
  const [publishState, publishAction, publishing] = useActionState(publish, {});
  const [disableState, disableAction, disabling] = useActionState(disable, {});
  const [archiveState, archiveAction, archiving] = useActionState(archive, {});
  const [confirmingArchive, setConfirmingArchive] = useState(false);

  // Archived is terminal in apothem-api; the UI only reflects that.
  if (status === "archived") {
    return <p className={styles.note}>This agent is archived. It is kept for history and cannot be changed.</p>;
  }

  return (
    <div className={styles.controls}>
      <div className={styles.row}>
        <form action={publishAction}>
          <Button type="submit" disabled={publishing}>
            Publish new version
          </Button>
        </form>

        {status !== "disabled" ? (
          <form action={disableAction}>
            <Button type="submit" variant="secondary" disabled={disabling}>
              Disable
            </Button>
          </form>
        ) : null}

        {!confirmingArchive ? (
          <Button type="button" variant="secondary" onClick={() => setConfirmingArchive(true)}>
            Archive
          </Button>
        ) : null}
      </div>

      {confirmingArchive ? (
        <form action={archiveAction} className={styles.confirm}>
          <p>Archiving cannot be undone. The agent and its versions are kept for history.</p>
          <div className={styles.row}>
            <Button type="submit" disabled={archiving}>
              Confirm archive
            </Button>
            <Button type="button" variant="secondary" onClick={() => setConfirmingArchive(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <Message state={publishState} />
      <Message state={disableState} />
      <Message state={archiveState} />
    </div>
  );
}
