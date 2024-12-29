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
  transparent = false,
  onLogout,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        "bg-transparent"
        // transparent ? 'bg-transparent' : 'bg-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/uncle-oscar-small-logo.svg"
              alt="Logo"
              width={60}
              height={60}
              className="invert"
            />
          </Link>

          {/* Navigation Items */}
          {user ? (
            // Logged in navigation
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-200 hover:text-white"
              >
                Dashboard
              </Link>
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
    </nav>
  );
}
