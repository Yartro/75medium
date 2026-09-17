import type { TeamMemberSummary } from "../api/types";
import { Flap, type FlapState } from "./Flap";

export function TeamMemberCard({ member }: { member: TeamMemberSummary }) {
  return (
    <div className="team-card">
      <div className="team-card__top">
        <span className="team-card__name">{member.name}</span>
        <span className="team-card__stat">
          {member.status === "not_started" && "Nog niet gestart"}
          {member.status === "active" && `Dag ${member.dayNumber} / ${member.totalRequiredDays}`}
          {member.status === "complete" && "Afgerond"}
        </span>
      </div>
      <div className="team-card__dots">
        {member.recentDays.map((d) => {
          const state: FlapState = d.achieved ? "done" : d.isToday ? "blank" : "missed";
          return (
            <Flap
              key={d.date}
              size="xs"
              state={state}
              className={d.isToday ? "flap--today" : undefined}
              title={d.date}
            />
          );
        })}
      </div>
    </div>
  );
}
