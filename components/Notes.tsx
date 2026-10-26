import type { GrammarSection } from "@/content/types";

export default function Notes({ notes }: { notes: GrammarSection[] }) {
  return (
    <div className="panel">
      {notes.map((n) => (
        <section key={n.title} className="note">
          <h3>{n.title}</h3>
          {n.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {n.table && (
            <div className="table-wrap">
              <table>
                {n.table.head.some(Boolean) && (
                  <thead>
                    <tr>
                      {n.table.head.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {n.table.rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((c, j) => (
                        <td key={j}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {n.tip && <p className="tip">{n.tip}</p>}
        </section>
      ))}
    </div>
  );
}
