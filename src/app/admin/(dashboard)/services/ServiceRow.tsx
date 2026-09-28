"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function ServiceRow({ id, children }: { id: string; children: ReactNode }) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/admin/services/${id}`)}
      className="cursor-pointer border-b border-black/5 last:border-0 hover:bg-black/2"
    >
      {children}
    </tr>
  );
}
