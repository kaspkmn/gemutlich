import type { Gender } from "@/content/types";

export const genderClass = (g?: Gender) => (g ? `g-${g}` : "");

export default function GenderTag({ gender }: { gender?: Gender }) {
  if (!gender) return null;
  const label = { m: "masculine", f: "feminine", n: "neuter", pl: "plural" }[gender];
  return <span className={`gender g-${gender}`}>{label}</span>;
}

/** Render "der Hund" with the article tinted in its gender color. */
export function GermanWord({ de, gender }: { de: string; gender?: Gender }) {
  const m = /^(der|die|das) (.+)$/.exec(de);
  if (!gender || !m) return <>{de}</>;
  return (
    <>
      <span className="article">{m[1]}</span> {m[2]}
    </>
  );
}
