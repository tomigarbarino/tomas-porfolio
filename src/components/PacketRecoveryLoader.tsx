"use client";

import dynamic from "next/dynamic";

const PacketRecoveryGame = dynamic(() => import("./PacketRecoveryGame"), {
  ssr: false,
  loading: () => <div className="secret404__loading" role="status"><p>Lost + Found / Packet recovery</p><span>Preparing eight lost packets…</span></div>,
});

export function PacketRecoveryLoader() {
  return <PacketRecoveryGame />;
}
