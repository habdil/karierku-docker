import { Metadata } from "next";
import ContactPage from "@/components/public/contact";

export const metadata: Metadata = {
  title: "Kontak Kami | CareerPathway",
  description: "Hubungi kami untuk informasi lebih lanjut tentang layanan bimbingan karir dan konsultasi di CareerPathway.",
  keywords: [
    "contact",
    "career guidance",
    "mentorship",
    "consultation",
    "career pathway contact",
  ],
};

export default function Page() {
  return <ContactPage />;
}