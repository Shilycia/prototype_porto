'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/about', label: 'About', icon: 'person' },
    { href: '/works', label: 'Works', icon: 'photo_library' },
    { href: '/contact', label: 'Contact', icon: 'mail' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-2xl transition-all duration-300">
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group z-50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-purple-700 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.4)] group-hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-black text-base">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight leading-none text-white">
                Diyul<span className="text-gradient-purple">.</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-purple-400 uppercase leading-tight font-mono">
                Visual Artist
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/[0.03] p-1.5 rounded-full border border-white/[0.06] backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-purple-600/40 to-fuchsia-600/30 border border-purple-500/40 shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-bold btn-glow shadow-[0_0_20px_rgba(147,51,234,0.35)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all duration-300 group hover:-translate-y-0.5"
          >
            <span>Hire Me</span>
            <Icon name="arrow_forward" size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label={isMobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="7" x2="20" y2="7"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="17" x2="20" y2="17"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <div
        className={`md:hidden fixed inset-x-0 top-[65px] sm:top-[81px] bottom-0 bg-black/95 backdrop-blur-3xl border-b border-purple-500/20 transition-all duration-300 ease-in-out z-40 overflow-y-auto px-6 py-8 flex flex-col justify-between ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold font-mono tracking-widest text-purple-400 uppercase px-3 mb-1">
            Navigasi Utama
          </p>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl text-base font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-fuchsia-600/20 text-white border border-purple-500/40 shadow-[0_0_20px_rgba(147,51,234,0.25)]'
                    : 'text-gray-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-purple-400 shadow-[0_0_8px_#c084fc]' : 'bg-gray-600'}`} />
                  <span>{link.label}</span>
                </div>
                <Icon
                  name="chevron_right"
                  size={18}
                  className={isActive ? 'text-purple-400' : 'text-gray-600'}
                />
              </Link>
            );
          })}
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-3 mt-8">
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 text-white text-base font-bold shadow-[0_0_30px_rgba(147,51,234,0.4)]"
          >
            <span>Start a Project / Hire Me</span>
            <Icon name="arrow_forward" size={18} />
          </Link>
          <p className="text-center text-xs text-gray-500 mt-2 font-mono">
            shilycia's DEV &bull; Portfolio Experience
          </p>
        </div>
      </div>
    </nav>
  );
}
