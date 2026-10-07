"use client";

import { useEffect, useState } from "react";

/**
 * React resets a form after its action runs. Controlled text fields recover,
 * but a controlled <select> is put back on its first option while state still
 * holds the chosen value, so the screen shows one thing and the next submit
 * sends another (for example "Owner" instead of the role the user picked).
 *
 * Use the returned number in the `key` of such selects: each action result
 * remounts them, which re-applies the controlled value.
 */
export function useControlledResetKey(result: unknown): number {
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    if (result !== undefined && result !== null && Object.keys(result as object).length > 0) {
      setEpoch((current) => current + 1);
    }
  }, [result]);
  return epoch;
}
