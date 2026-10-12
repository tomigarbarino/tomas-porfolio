import "./case-loading.css";

export default function CaseLoading() {
  return (
    <main className="case-loading" aria-busy="true" aria-labelledby="case-loading-title">
      <p className="case-loading__label">Tomás Garbarino / Case studies</p>
      <p id="case-loading-title" className="case-loading__title">Opening<br /><span>the case.</span></p>
      <p className="case-loading__status" role="status"><span aria-hidden="true" />Loading the case study…</p>
    </main>
  );
}
