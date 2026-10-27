"use client";

import Link from "next/link";
import { DIALOGUES } from "@/content/dialogues";
import { getUnit } from "@/content/course";
import { useStore } from "@/lib/store";
import SubNav from "@/components/SubNav";
import { IconCheck, IconHeadphones } from "@/components/Icons";

export default function ListenPage() {
  const { state } = useStore();
  return (
    <div className="page">
      <SubNav group="learn" />
      <div className="page-head">
        <h1>Listening</h1>
        <p className="sub">
          Short conversations read aloud. Listen first without reading, answer the questions, then check the transcript.
        </p>
      </div>
      <div className="card-list">
        {DIALOGUES.map((d) => {
          const unit = getUnit(d.after)!;
          const open = Boolean(state.units[d.after]?.completed);
          const done = Boolean(state.read[`dialogue:${d.id}`]);
          return (
            <Link
              key={d.id}
              href={`/listen/${d.id}`}
              className="card-link"
              aria-disabled={open ? undefined : "true"}
              tabIndex={open ? undefined : -1}
            >
              <span className="grow">
                <b style={{ display: "block" }}>{d.title}</b>
                <span className="small muted">{open ? d.setting : `Opens after lesson ${unit.n}: ${unit.title}`}</span>
              </span>
              {done ? <IconCheck size={18} className="red" /> : open ? <IconHeadphones size={18} className="faint" /> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
