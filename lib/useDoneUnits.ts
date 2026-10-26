"use client";

import { useMemo } from "react";
import { useStore } from "./store";

/** Ids of finished lessons, in course order. */
export function useDoneUnits(): string[] {
  const { state } = useStore();
  return useMemo(() => Object.keys(state.units).filter((id) => state.units[id].completed), [state.units]);
}
