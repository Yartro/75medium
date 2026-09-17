import { useTeam } from "../api/queries";
import { TeamMemberCard } from "../components/TeamMemberCard";

export function TeamPage() {
  const { data, isLoading, isError } = useTeam();

  if (isLoading) return <div className="center-status">Laden...</div>;
  if (isError || !data) return <div className="center-status">Kon teamstatus niet laden.</div>;

  return (
    <div className="page">
      <p className="section-title">Team voortgang</p>
      {data.members.map((member) => (
        <TeamMemberCard key={member.userId} member={member} />
      ))}
    </div>
  );
}
