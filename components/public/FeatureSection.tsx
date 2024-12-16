import { Sparkles, MessagesSquare, Calendar } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Personalisasi Karir Berbasis AI",
    description: "Dapatkan rekomendasi karir yang dipersonalisasi khusus untukmu menggunakan teknologi AI",
  },
  {
    icon: MessagesSquare,
    title: "Konsultasi Karir",
    description: "Konsultasi langsung dengan mentor berpengalaman dari berbagai bidang industri",
  },
  {
    icon: Calendar,
    title: "Event Penunjang Karir",
    description: "Ikuti berbagai event, workshop, dan webinar untuk mengembangkan skill dan network",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-primary-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">
            Mengapa Memilih Kami?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Kami menyediakan layanan terbaik untuk pengembangan karirmu
          </p>
        </div>

        <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="rounded-full bg-primary-100 p-4">
                <feature.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-primary-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-center text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}