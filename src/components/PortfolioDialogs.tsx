"use client";

import Link from "next/link";
import { useEffect, useRef, type MouseEvent } from "react";
import { ArtifactDrag } from "./ArtifactDrag";
import { VisitorMissions } from "./VisitorMissions";
import "./portfolio-dialogs.css";

export type PortfolioDialog = "profile" | "quests" | null;
type Props = { selected: PortfolioDialog; onDismiss: () => void };
export function PortfolioDialogs({ selected, onDismiss }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const navigationTarget = useRef<HTMLElement | null>(null);
  const dismiss = useRef(onDismiss);
  useEffect(() => { dismiss.current = onDismiss; }, [onDismiss]);

  useEffect(() => {
    const node = dialog.current;
    if (!node || !selected) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    navigationTarget.current = null;
    node.showModal();
    close.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      if (node.open) node.close();
      document.body.style.overflow = overflow;
      const destination = navigationTarget.current;
      if (destination) {
        // Close the modal before native fragment scrolling and focus transfer.
        if (window.location.hash === "#" + destination.id) destination.scrollIntoView({ block: "start" });
        else window.location.hash = destination.id;
        requestAnimationFrame(() => {
          if (!node.open && destination.isConnected) destination.focus({ preventScroll: true });
        });
      } else previous?.focus({ preventScroll: true });
    };
  }, [selected]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.tabIndex = -1;
    navigationTarget.current = target;
    onDismiss();
  }

  return (
    <dialog ref={dialog} className="portfolio-dialog" data-drag-frame aria-labelledby="dialog-title" onClose={() => dismiss.current()} onClick={e => {
      if (e.target !== e.currentTarget) return;
      const rect = e.currentTarget.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dismiss.current();
    }}>
      <div className="dialog-bar"><span>{selected === "profile" ? "QUICK PROFILE / TOMÁS GARBARINO" : "YOUR MISSIONS"}</span><ArtifactDrag label="Move this window" /><button ref={close} type="button" aria-label="Close dialog" onClick={onDismiss}>×</button></div>
      <div className="dialog-content">
        {selected === "profile" ? <>
          <p className="eyebrow">PRODUCT ENGINEER / APPLIED AI</p>
          <h2 id="dialog-title">Product Engineer.<br />Applied AI.</h2>
          <p>Currently at Flock I+D.</p>
          <dl className="profile-grid"><div><dt>Current products</dt><dd>Agora · Product Owner<br />Trainly · Product Engineer</dd></div><div><dt>Opportunities</dt><dd>Product Engineer / Forward Deployed Engineer</dd></div><div><dt>Product status</dt><dd>Agora and Trainly are used by clients and growing.</dd></div></dl>
          <div className="dialog-actions"><a className="button-primary" href="#work" onClick={event => navigate(event, "work")}>View case studies →</a><a href="mailto:tomasgarbarino.dev@gmail.com">Get in touch ↗</a></div>
          <p><Link href="/writing/jev">Read the JEV research →</Link></p><div className="profile-links"><a href="https://www.linkedin.com/in/tomas-garbarino/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/tomigarbarino" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        </> : <VisitorMissions active={selected === "quests"} onDismiss={onDismiss} onNavigate={navigate} />}
      </div>
    </dialog>
  );
}
