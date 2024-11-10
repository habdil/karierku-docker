'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const images = [
    '/images/carousel/image1.png',
    '/images/carousel/image2.png',
    '/images/carousel/image3.png'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-gradient-to-r from-blue-900 to-blue-800">
      {/* Overlay gradient - Adjusted for better mobile readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-900/80 md:from-blue-900/90 md:to-transparent z-10"></div>

      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={img}
              alt={`Career background ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Content - Adjusted padding for mobile */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex min-h-[100svh] items-center">
        <div className="w-full py-12 md:py-24">
          <div className="grid gap-8 md:gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Text Content - Improved mobile typography */}
            <div className="flex flex-col justify-center text-white">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl">
                Bangun Karir Impianmu
                <span className="text-secondary-500"> Bersama Kami</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:text-xl text-white">
                Temukan jalan menuju kesuksesan karirmu dengan bimbingan dari mentor profesional
                dan program pengembangan yang dirancang khusus untukmu.
              </p>

              {/* CTA Buttons - Improved mobile layout */}
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white"
                  asChild
                >
                  <Link href="/register">Mulai Sekarang</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10 text-primary-900"
                  asChild
                >
                  <Link href="/about">Pelajari Lebih Lanjut</Link>
                </Button>
              </div>
            </div>

            {/* Optional: Placeholder for right column content on desktop */}
            <div className="hidden lg:block"></div>
          </div>
        </div>

        {/* Carousel Navigation Dots - Adjusted position for mobile */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImageIndex === index 
                  ? 'bg-orange-500 w-4' 
                  : 'bg-white/50 hover:bg-white'
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;