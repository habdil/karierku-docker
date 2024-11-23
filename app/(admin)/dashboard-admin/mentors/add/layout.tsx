import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Mentor Baru - Admin Dashboard",
  description: "Tambahkan mentor baru ke platform",
};

export default function AddMentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}