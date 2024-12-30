import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Menu, ChevronDown } from "lucide-react";

interface NavigationProps {
  user?: User | null;
  transparent?: boolean;
  onLogout?: () => void;
}

export default function Navigation({
  user,
//   transparent = false,
  onLogout,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        "bg-transparent"
        // transparent ? 'bg-transparent' : 'bg-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center"
            >
              <Image
                src="/uncle-oscar-small-logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="invert"
              />
            </Link>

            <Link href="/about" className="hidden sm:block text-gray-200 hover:text-white ml-4">
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Navigation Items */}
          <div className="hidden sm:block">
            {user ? (
              // Logged in navigation
              <div className="flex items-center gap-4">
                <Link href="/photos" className="text-gray-200 hover:text-white">
                  Photos
                </Link>
                <Link
                  href="/documents"
                  className="text-gray-200 hover:text-white"
                >
                  Documents
                </Link>
                <Link
                  href="/familytree"
                  className="text-gray-200 hover:text-white"
                >
                  Family Tree
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 text-gray-200 hover:text-white"
                  >
                    {user.email}
                    <ChevronDown size={16} />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={onLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Non-logged in navigation
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-gray-200 hover:text-white px-4 py-2"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
              <Link href="/about" className="block text-gray-200 hover:text-white px-3 py-2">
                About
              </Link>
              {user ? (
                <>
                  <Link href="/photos" className="block text-gray-200 hover:text-white px-3 py-2">
                    Photos
                  </Link>
                  <Link href="/documents" className="block text-gray-200 hover:text-white px-3 py-2">
                    Documents
                  </Link>
                  <Link href="/familytree" className="block text-gray-200 hover:text-white px-3 py-2">
                    Family Tree
                  </Link>
                  <Link href="/profile" className="block text-gray-200 hover:text-white px-3 py-2">
                    Profile
                  </Link>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left text-gray-200 hover:text-white px-3 py-2"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block text-gray-200 hover:text-white px-3 py-2">
                    Sign in
                  </Link>
                  <Link href="/signup" className="block text-gray-200 hover:text-white px-3 py-2">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
