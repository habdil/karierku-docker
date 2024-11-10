"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Event", href: "/events" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") {
      return false;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-auto h-8"
            />
            <span className="hidden font-semibold sm:block text-primary-900">
              Karierku
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium transition-colors hover:text-black group py-2
                  ${isActive(item.href) 
                    ? "text-black" 
                    : "text-muted-foreground"
                  }`}
              >
                {item.name}
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 transition-all duration-200 ease-out transform
                    ${isActive(item.href)
                      ? "bg-orange-500 scale-x-100"
                      : "bg-orange-500 scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </Link>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="text-gray-50 bg-primary-600 hover:bg-primary-700" asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium rounded-md relative
                  ${isActive(item.href)
                    ? "text-black bg-primary-50"
                    : "text-muted-foreground hover:text-black hover:bg-primary-50"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute inset-y-0 left-0 w-1 bg-orange-500 rounded-r" />
                )}
              </Link>
            ))}
            <div className="grid gap-2 px-3 py-2">
              <Button variant="ghost" className="w-full justify-center bg-gray-100" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;