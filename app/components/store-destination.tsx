"use client";

import { useSyncExternalStore } from "react";
import { repFromCookieHeader, repStoreHost } from "../lib/reps";

const subscribe = () => () => {};

/**
 * Says where the store link leads. Without JavaScript, or before this browser
 * has been given a representative, it names no one.
 */
export function StoreDestination() {
  const handle = useSyncExternalStore(
    subscribe,
    () => repFromCookieHeader(document.cookie),
    () => undefined,
  );

  return (
    <small>
      {handle
        ? `You'll leave Joy Health for ${repStoreHost(handle)}, an independent USANA representative's store.`
        : "You'll leave Joy Health for an independent USANA representative's store."}
    </small>
  );
}
