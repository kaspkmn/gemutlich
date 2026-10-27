"use client";

import Link from "next/link";
import { STORIES } from "@/content/stories";
import { getUnit } from "@/content/course";
import { useStore } from "@/lib/store";
import SubNav from "@/components/SubNav";
import { IconCheck, IconRead } from "@/components/Icons";

export default function ReadPage() {
  const { state } = useStore();
  const opened = STORIES.filter((s) => state.units[s.after]?.completed).length;

  return (
    <div className="page">
      <SubNav group="learn" />
      <div className="page-head">
        <h1>Stories</h1>
        <p className="sub">
          Short stories at your level. Tap any word to see what it means and save it to your flashcards. A new story opens as you
          finish lessons.
        </p>
      </div>

      <div className="card-list">
        {STORIES.map((s) => {
          const unit = getUnit(s.after)!;
          const open = Boolean(state.units[s.after]?.completed);
          const read = Boolean(state.read[`story:${s.id}`]);
          return (
            <Link
              key={s.id}
              href={`/read/${s.id}`}
              className="card-link"
              aria-disabled={open ? undefined : "true"}
              tabIndex={open ? undefined : -1}
            >
              <span className="grow">
                <b lang="de" style={{ display: "block" }}>
                  {s.title}
                </b>
                <span className="small muted">{open ? s.titleEn : `Opens after lesson ${unit.n}: ${unit.title}`}</span>
                {open && (
                  <span className="tiny faint" style={{ display: "block", marginTop: 2 }}>
                    {s.blurb}
                  </span>
                )}
              </span>
              {read ? <IconCheck size={18} className="red" /> : open ? <IconRead size={18} className="faint" /> : null}
            </Link>
          );
        })}
      </div>
      {opened === 0 && <p className="small faint">The first story opens after lesson 3.</p>}
    </div>
  );
}
