import { Metadata } from "next";
import AboutPage from "@/components/public/about";

export const metadata: Metadata = {
  title: "Tentang Kami | KarierKu",
  description: "KarierKu adalah platform bimbingan karir berbasis web yang dirancang khusus untuk membantu mahasiswa memahami keterampilan, minat, dan nilai-nilai pribadi mereka.",
  keywords: [
    "KarierKu",
    "mentorship",
    "professional development",
    "student career",
    "career pathway",
  ],
};

export default function Page() {
  return <AboutPage />;
}