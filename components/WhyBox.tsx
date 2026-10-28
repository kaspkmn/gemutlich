"use client";

import Link from "next/link";
import { diffTokens, type Explanation } from "@/lib/explain";
import { norm, tokens } from "@/lib/answers";

/** Shows why an answer was wrong (or why the right one is right). */
export default function WhyBox({ why, title = "Why" }: { why: Explanation; title?: string }) {
  const empty = !why.points.length && !why.letters && !why.words && !why.table;
  if (empty) return null;
  return (
    <div className="why">
      <p className="why-title">{title}</p>
      {why.points.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {why.letters && <LetterDiff given={why.letters.given} answer={why.letters.answer} />}
      {why.words && <WordDiff given={why.words.given} answer={why.words.answer} />}
      {why.table && (
        <table className="why-table" lang="de">
          <caption>{why.table.title}</caption>
          <tbody>
            {why.table.rows.map(([p, f], i) => (
              <tr key={i} className={i === why.table!.highlight ? "on" : undefined}>
                <td>{p}</td>
                <td>{f}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {why.link && (
        <Link href={why.link.href} className="why-link">
          {why.link.label} →
        </Link>
      )}
    </div>
  );
}

function LetterDiff({ given, answer }: { given: string; answer: string }) {
  const ops = diffTokens([...given.toLowerCase()], [...answer.toLowerCase()]);
  // keep the answer's own capitals
  let ai = 0;
  const answerChars = [...answer];
  return (
    <div className="diff" lang="de">
      <div>
        <span className="diff-label">You</span>
        <span>
          {ops
            .filter((o) => o.op !== "add")
            .map((o, i) => (
              <span key={i} className={o.op === "del" ? "d-del" : undefined}>
                {o.text}
              </span>
            ))}
        </span>
      </div>
      <div>
        <span className="diff-label">Right</span>
        <span>
          {ops
            .filter((o) => o.op !== "del")
            .map((o, i) => {
              const ch = answerChars[ai++] ?? o.text;
              return (
                <span key={i} className={o.op === "add" ? "d-add" : undefined}>
                  {ch}
                </span>
              );
            })}
        </span>
      </div>
    </div>
  );
}

function WordDiff({ given, answer }: { given: string; answer: string }) {
  const ops = diffTokens(tokens(given), tokens(answer), (a, b) => norm(a) === norm(b));
  return (
    <div className="diff" lang="de">
      <div>
        <span className="diff-label">You</span>
        <span className="diff-words">
          {given.trim()
            ? ops
                .filter((o) => o.op !== "add")
                .map((o, i) => (
                  <span key={i} className={o.op === "del" ? "d-del" : undefined}>
                    {o.text}
                  </span>
                ))
            : <span className="faint">(nothing)</span>}
        </span>
      </div>
      <div>
        <span className="diff-label">Right</span>
        <span className="diff-words">
          {ops
            .filter((o) => o.op !== "del")
            .map((o, i) => (
              <span key={i} className={o.op === "add" ? "d-add" : undefined}>
                {o.text}
              </span>
            ))}
        </span>
      </div>
    </div>
  );
}
