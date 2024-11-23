import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Mentor - Admin Dashboard",
  description: "Edit informasi mentor",
};

export default function EditMentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}