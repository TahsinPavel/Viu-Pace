"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Menu, X, Sparkles, ArrowRight } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-zinc-900 font-bold text-xl tracking-tight cursor-pointer group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight">
            Viu<span className="text-blue-600">Pace</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <Link href="#features" className="hover:text-zinc-900 transition-colors cursor-pointer">
            Features
          </Link>
          <Link href="#solutions" className="hover:text-zinc-900 transition-colors cursor-pointer">
            Solutions
          </Link>
          <Link href="#preview" className="hover:text-zinc-900 transition-colors cursor-pointer">
            Live Preview
          </Link>
          <Link href="#pricing" className="hover:text-zinc-900 transition-colors cursor-pointer">
            Pricing
          </Link>
        </nav>

        {/* Top Right Action & Dashboard Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900 cursor-pointer font-medium">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 font-semibold px-4 py-2 flex items-center gap-2 cursor-pointer rounded-lg">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/dashboard">
            <Button size="sm" className="bg-blue-600 text-white flex items-center gap-1.5 cursor-pointer text-xs">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Button>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-3 text-base font-medium text-zinc-700">
            <Link
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Solutions
            </Link>
            <Link
              href="#preview"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Live Preview
            </Link>
            <Link
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Pricing
            </Link>
          </nav>
          <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center text-zinc-700">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
