"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PACKET_SIGNALS, createPacketGame, resetPacketGame, selectPacket, shufflePacketDeck } from "@/lib/packet-memory";
import { useMotionPreference } from "./MotionPreference";
import "./packet-recovery-game.css";

export default function PacketRecoveryGame() {
  const [game, setGame] = useState(createPacketGame);
  const { paused } = useMotionPreference();
  const packets = useRef<Array<HTMLButtonElement | null>>([]);
  const rewardHeading = useRef<HTMLHeadingElement>(null);
  const replayFocus = useRef(false);
  const won = game.status === "won";
  const count = game.matched.length / 2;
  const status = won ? "All four signals recovered. Secret unlocked."
    : game.revealed.length === 2 ? "Different signals. Choose another sealed packet to continue."
    : game.revealed.length === 1 ? "One packet open. Find its matching signal."
    : count > 0 ? `Signal recovered. ${count} of 4 pairs found.`
    : "Reveal two packets. Find all four matching pairs.";

  useEffect(() => {
    if (won) rewardHeading.current?.focus({ preventScroll: true });
    else if (replayFocus.current) {
      replayFocus.current = false;
      packets.current[0]?.focus({ preventScroll: true });
    }
  }, [won, game.deck]);

  function reveal(index: number) {
    const firstDeck = game.deck ?? shufflePacketDeck();
    setGame(current => selectPacket(current, index, firstDeck));
  }

  function reset(replay = false) {
    replayFocus.current = replay;
    setGame(resetPacketGame(shufflePacketDeck()));
  }

  function boardKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("button[data-packet]") : null;
    if (!button) return;
    const index = Number(button.dataset.packet);
    const columns = window.matchMedia("(max-width: 600px)").matches ? 2 : 4;
    const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns }[event.key];
    if (delta !== undefined || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? 7 : (index + delta! + 8) % 8;
      packets.current[next]?.focus();
    } else if (/^[1-8]$/.test(event.key)) {
      event.preventDefault();
      const next = Number(event.key) - 1;
      packets.current[next]?.focus();
      reveal(next);
    }
  }

  return (
    <div className="packet-game" data-paused={paused} data-complete={won}>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{status}</p>
      {won ? (
        <section className="packet-game__reward" aria-labelledby="curiosity-title">
          <div className="packet-game__reward-bar"><span>curiosity.txt</span><span aria-hidden="true">[OK]</span></div>
          <div className="packet-game__reward-content">
            <p className="packet-game__eyebrow">Secret 01 / Recovered</p>
            <h2 id="curiosity-title" ref={rewardHeading} tabIndex={-1}>Hello,<br />curious human.</h2>
            <div className="packet-game__reward-rule" />
            <p className="packet-game__reward-thought">Small experiments.<br />Real products.</p>
            <p className="packet-game__reward-copy">That is how this whole thing started.<br />Keep exploring.</p>
            <div className="packet-game__actions"><Link href="/#work" className="button-primary">Explore the work ↗</Link><button type="button" onClick={() => reset(true)}>Play again ↺</button></div>
          </div>
        </section>
      ) : (
        <section className="packet-game__window" aria-labelledby="packet-game-title">
          <div className="packet-game__bar"><h2 id="packet-game-title">Lost + Found<span> / Packet recovery</span></h2><button className="packet-game__reset" type="button" onClick={() => reset()} aria-label="Reset packet game">Reset <span aria-hidden="true">↺</span></button></div>
          <div className="packet-game__content">
            <div className="packet-game__goal"><p><span className="packet-game__goal-full">Recover four lost signals</span><span className="packet-game__goal-short">Find 4 pairs</span></p><div className="packet-game__progress" role="progressbar" aria-label="Recovered signal pairs" aria-valuemin={0} aria-valuemax={4} aria-valuenow={count}>{[0, 1, 2, 3].map(i => <span key={i} data-recovered={i < count} />)}</div></div>
            <div className="packet-game__board" role="group" aria-label="Eight signal packets" aria-describedby="packet-game-instructions" onKeyDown={boardKey}>
              {Array.from({ length: 8 }, (_, index) => {
                const recovered = game.matched.includes(index);
                const open = recovered || game.revealed.includes(index);
                const signal = open ? PACKET_SIGNALS.find(item => item.id === game.deck?.[index]) : undefined;
                const number = String(index + 1).padStart(2, "0");
                const state = recovered ? "recovered" : open ? "revealed" : "sealed";
                const meaning = recovered ? "Recovered" : signal?.label ?? "Sealed";
                return <button key={index} ref={node => { packets.current[index] = node; }} type="button" className="packet-game__packet" data-packet={index} data-state={state} aria-disabled={recovered} onClick={() => reveal(index)}><span className="packet-game__chrome"><span>PACKET_{number}</span>{" "}<span>{number}</span></span>{" "}<span className="packet-game__face"><span className="packet-game__glyph">{signal?.glyph ?? "?"}</span>{" "}<span className="packet-game__meaning">{meaning}</span></span>{open && !recovered ? <span className="sr-only">, revealed</span> : null}</button>;
              })}
            </div>
            <p className="packet-game__status" id="packet-game-instructions">{status}</p>
            <p className="packet-game__quiet">No timer. No lives. Just a little curiosity.</p>
          </div>
        </section>
      )}
    </div>
  );
}
