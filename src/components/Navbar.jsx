'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed w-full top-0 z-50">
      <nav className="bg-black border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-12">
              <Link href="/" className="flex-shrink-0">
                <span className="text-xl font-light tracking-wide">PROJET FIL ROUGE</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/about" className="hover-link text-sm">
                  ABOUT
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              {user ? (
                <>
                  <div className="hidden md:flex items-center space-x-8">
                    <Link href="/messages" className="hover-link text-sm">
                      MESSAGES
                    </Link>
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="hover-link text-sm flex items-center gap-2"
                    >
                      <span>{user.name}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  {isMenuOpen && (
                    <div className="absolute right-6 top-full mt-2 w-48 bg-black border border-white/10 backdrop-blur-lg">
                      <div className="py-2">
                        <Link
                          href="/my-ads"
                          className="block px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          MY ADS
                        </Link>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          PROFILE
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                        >
                          LOGOUT
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-8">
                  <Link href="/login" className="hover-link text-sm">
                    LOGIN
                  </Link>
                  <Link href="/register" className="hover-link text-sm">
                    REGISTER
                  </Link>
                </div>
              )}
              <div className="hidden md:block">
                <Link
                  href="/contact"
                  className="text-sm border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors duration-300"
                >
                  LET'S TALK
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Barre de catégories */}
      <div className="bg-black border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex space-x-8 py-4 overflow-x-auto custom-scrollbar">
            <Link href="/category/immobilier" className="hover-link text-sm whitespace-nowrap">IMMOBILIER</Link>
            <Link href="/category/vehicules" className="hover-link text-sm whitespace-nowrap">VÉHICULES</Link>
            <Link href="/category/locations" className="hover-link text-sm whitespace-nowrap">LOCATIONS</Link>
            <Link href="/category/emploi" className="hover-link text-sm whitespace-nowrap">EMPLOI</Link>
            <Link href="/category/mode" className="hover-link text-sm whitespace-nowrap">MODE</Link>
            <Link href="/category/maison" className="hover-link text-sm whitespace-nowrap">MAISON</Link>
            <Link href="/category/multimedia" className="hover-link text-sm whitespace-nowrap">MULTIMÉDIA</Link>
            <Link href="/category/loisirs" className="hover-link text-sm whitespace-nowrap">LOISIRS</Link>
            <Link href="/category/autres" className="hover-link text-sm whitespace-nowrap">AUTRES</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 