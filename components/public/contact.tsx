"use client"

import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageSquare, Send, ExternalLink, InstagramIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Component untuk Google Maps
const Map = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.939401124964!2d110.41340677486535!3d-7.684966076991621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5e970cd4fa51%3A0x2f3b2b5f78d8f535!2sUniversitas%20Islam%20Indonesia!5e0!3m2!1sen!2sid!4v1702908124067!5m2!1sen!2sid"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen={false}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="rounded-xl"
    />
  );
};

// Data kontak
const contactInfo = [
  {
    icon: MapPin,
    title: "Alamat",
    details: "Kampus Terpadu UII, Jl. Kaliurang KM 14,5 Sleman, Yogyakarta",
    color: "from-primary-400/10 to-primary-500/10 hover:from-primary-400/20 hover:to-primary-500/20",
    link: "https://goo.gl/maps/ysqv9GQQcmhxJcss7"
  },
  {
    icon: Mail,
    title: "Email",
    details: "karierku@gmail.com",
    color: "from-secondary-400/10 to-secondary-500/10 hover:from-secondary-400/20 hover:to-secondary-500/20",
    link: "mailto:karierku@gmail.com"
  },
  {
    icon: Phone,
    title: "Telepon",
    details: "+62 85 975 360 990",
    color: "from-primary-400/10 to-secondary-400/10 hover:from-primary-400/20 hover:to-secondary-400/20",
    link: "tel:085975360990"
  },
  {
    icon: InstagramIcon,
    title: "Instagram",
    details: "@KarierKu",
    color: "from-secondary-400/10 to-primary-400/10 hover:from-secondary-400/20 hover:to-primary-400/20",
    link: "https://instagram.com/future_crafted"
  },
];

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/90 via-secondary-50/50 to-primary-50/90 dark:from-primary-950 dark:via-secondary-900/50 dark:to-primary-950" />
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
            animate={{
              backgroundPosition: ["0px 0px", "60px 60px"],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                Hubungi Kami
              </span>
            </motion.div>
            <motion.h1
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 sm:text-5xl"
              variants={itemVariants}
            >
              Mari Terhubung Dengan Kami
            </motion.h1>
            <motion.p
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Kami siap membantu Anda dalam pengembangan karir. Jangan ragu untuk menghubungi kami.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex gap-4 p-6 rounded-xl bg-gradient-to-br cursor-pointer transition-all duration-300",
                      "hover:shadow-lg group",
                      info.color
                    )}
                    variants={itemVariants}
                  >
                    <div className="rounded-full p-2.5 bg-white/80 dark:bg-white/10">
                      <info.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-primary-900 dark:text-primary-100 flex items-center gap-2">
                        {info.title}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {info.details}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* FAQ atau Additional Info bisa ditambahkan di sini */}
              <motion.div
                className="mt-12 p-6 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/50 dark:to-secondary-900/50"
                variants={itemVariants}
              >
                <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-4">
                  Jam Operasional
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Senin - Jumat: 08.00 - 16.00 WIB</p>
                  <p>Sabtu: 08.00 - 12.00 WIB</p>
                  <p>Minggu: Tutup</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-secondary-100/50 dark:from-primary-900/50 dark:to-secondary-900/50 rounded-2xl transform -rotate-1" />
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-100/50 to-primary-100/50 dark:from-secondary-900/50 dark:to-primary-900/50 rounded-2xl transform rotate-1" />
              <div className="relative bg-white dark:bg-gray-950 rounded-2xl p-8 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-primary-900 dark:text-primary-100">
                      Nama Lengkap
                    </label>
                    <Input
                      id="name"
                      placeholder="Masukkan nama lengkap"
                      className="w-full"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-primary-900 dark:text-primary-100">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Masukkan email"
                      className="w-full"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2 text-primary-900 dark:text-primary-100">
                      Subjek
                    </label>
                    <Input
                      id="subject"
                      placeholder="Subjek pesan"
                      className="w-full"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-primary-900 dark:text-primary-100">
                      Pesan
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tuliskan pesan Anda"
                      className="w-full min-h-[150px]"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button type="submit" className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white">
                      Kirim Pesan
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="rounded-2xl overflow-hidden h-[500px] shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Map />
          </motion.div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Kampus Terpadu Universitas Islam Indonesia</p>
            <p className="mt-1">Jl. Kaliurang KM 14.5, Sleman, Yogyakarta</p>
          </div>
        </div>
      </section>

      {/* Decorative Footer Bar */}
      <div className="h-2 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />
    </div>
  );
}