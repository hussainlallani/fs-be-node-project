/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

// Client-side logic only — no metadata export here
export default function MetadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState(false);

  return <>{children}</>;
}
