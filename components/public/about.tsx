"use client"

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Target, Users2, ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Muhammad Nabil Hanif",
    role: "Project Manager",
    realImage: "/images/team/nabil.jpg",
    description: "Experienced in leading tech projects and ensuring successful delivery"
  },
  {
    name: "Habdil Iqrawardana",
    role: "Backend Developer",
    realImage: "/images/team/habdil.jpg",
    description: "Specializes in building robust and scalable backend systems"
  },
  {
    name: "Nur Astrid Damayanti",
    role: "Frontend Developer",
    realImage: "/images/team/astrid.jpg",
    description: "Creates beautiful and responsive user interfaces"
  },
  {
    name: "Vivi Zalzabilah ZI",
    role: "UI/UX Designer",
    realImage: "/images/team/vivi.jpg",
    description: "Designs intuitive and engaging user experiences"
  },
];

const values = [
  {
    icon: Brain,
    title: "Inovasi Berkelanjutan",
    description: "Kami terus berinovasi dalam mengembangkan solusi karir yang efektif",
    color: "from-primary-400/20 to-primary-600/20"
  },
  {
    icon: Target,
    title: "Fokus pada Hasil",
    description: "Berkomitmen untuk memberikan hasil terbaik bagi setiap mahasiswa",
    color: "from-secondary-400/20 to-secondary-600/20"
  },
  {
    icon: Users2,
    title: "Kolaborasi",
    description: "Bekerja sama dengan berbagai pihak untuk mencapai tujuan bersama",
    color: "from-primary-400/20 to-secondary-400/20"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with enhanced gradient */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-secondary-100 to-primary-200 dark:from-primary-900 dark:via-secondary-900 dark:to-primary-800">
          <motion.div
            className="absolute inset-0 opacity-30"
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
            <motion.div
              className="inline-block mb-6"
              variants={itemVariants}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-primary-950 dark:text-primary-50">
                <Sparkles className="w-4 h-4 mr-2" />
                Platform Bimbingan Karir Modern
              </span>
            </motion.div>
            <motion.h1
              className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 sm:text-5xl lg:text-6xl"
              variants={itemVariants}
            >
              Membangun Masa Depan Karir
            </motion.h1>
            <motion.p
              className="mt-6 text-lg leading-8 text-primary-800 dark:text-primary-200 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Platform inovatif yang menghubungkan mahasiswa dengan 
              peluang karir mereka melalui teknologi AI dan bimbingan profesional.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Values Section with enhanced cards */}
      <section className="py-24 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/50 to-transparent dark:via-primary-950/50"/>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid gap-8 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className={`relative group p-8 rounded-2xl bg-gradient-to-br ${value.color} backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300`}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="mb-6">
                  <div className="rounded-full bg-white/90 dark:bg-white/10 p-3 w-fit">
                    <value.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-700 dark:text-primary-300">
                  {value.description}
                </p>
                <motion.div 
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                >
                  <ArrowUpRight className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section with enhanced cards */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-secondary-50/30 to-primary-50 dark:from-primary-950 dark:via-secondary-950/30 dark:to-primary-950"/>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 mb-4"
              variants={itemVariants}
            >
              Tim Kami
            </motion.h2>
            <motion.p
              className="text-lg text-primary-900 dark:text-primary-300 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Dibangun oleh tim yang berdedikasi untuk membantu mahasiswa mencapai potensi karir terbaik mereka
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="group relative bg-white/80 dark:bg-primary-950/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary-100 dark:border-primary-800 hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-square relative rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-800 dark:to-secondary-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-600/30 dark:text-primary-400/30">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary-900 dark:text-primary-100 text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 dark:text-secondary-300">{member.role}</p>
                  <p className="text-sm text-gray-500 dark:text-primary-400 pt-2">
                    {member.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-primary-100 dark:border-primary-800">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100 group-hover:bg-primary-50 dark:group-hover:bg-primary-900"
                  >
                    Lihat Profil
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 opacity-30">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
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
            <div className="relative text-center p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Mulai Perjalanan Karirmu Sekarang
                </h2>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Bergabunglah dan temukan potensi terbaikmu bersama mentor profesional
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-secondary-600 hover:bg-white/90 hover:text-secondary-700 transition-all duration-300"
                >
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Achievement Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { number: "85%", label: "Tingkat Kepuasan", icon: "🎯" },
              { number: "50+", label: "Mentor Aktif", icon: "👥" },
              { number: "1000+", label: "Mahasiswa Terdaftar", icon: "🎓" },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/50 dark:to-primary-800/50 shadow-sm"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-primary-900 dark:text-primary-400 mb-2">
                  {stat.number}
                </div>
                <p className="text-primary-700 dark:text-primary-800">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final Contact Section */}
      <section className="py-16 bg-gradient-to-b from-white to-primary-50 dark:from-gray-950 dark:to-primary-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-semibold text-primary-900 dark:text-primary-100">
                Punya Pertanyaan?
              </h3>
              <p className="text-primary-600 dark:text-primary-400 max-w-2xl mx-auto">
                Tim kami siap membantu Anda menemukan jalur karir yang tepat
              </p>
              <Button
                variant="outline"
                size="lg"
                className="mt-4 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/50"
              >
                Hubungi Kami
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative Footer Bar */}
      <div className="h-2 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />
    </div>
  );
}