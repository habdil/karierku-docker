import { MentorList } from "@/components/client/consultations/MentorList";

export default function ConsultationPage() {
  const mentors = [
    {
      id: "1",
      fullName: "John Doe",
      company: "Google",
      jobRole: "Senior Software Engineer",
      education: "MIT Computer Science",
      isAvailableNow: true
    },

    {
      id: "1",
      fullName: "John Doe",
      company: "Google",
      jobRole: "Senior Software Engineer",
      education: "MIT Computer Science",
      isAvailableNow: true
    }
    // ... more mentors
  ];

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Find a Mentor</h1>
      <MentorList mentors={mentors} />
    </div>
  );
}