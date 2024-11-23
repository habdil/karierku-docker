import EditMentorContent from "./content";

export default function EditMentorPage({ 
  params 
}: { 
  params: { mentorId: string } 
}) {
  return <EditMentorContent params={params} />;
}