"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PowerOffIcon from "../components/PowerOffIcon";
import NavLinks from "../ui/dashboard/nav-links";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/login");
    } else {
      // Defer reading localStorage until after hydration to avoid SSR/CSR mismatch
      setUserEmail(localStorage.getItem("userEmail"));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setUserEmail("");
    router.push("/login");
  };


  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-slate-900 md:flex-row">
      {/* Top Header - Mobile */}
      <header className="md:hidden bg-blue-600 text-white px-4 py-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-600 font-bold">
            🌐
          </div>
          <span className="text-lg font-bold">Acme</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-colors font-semibold text-sm"
          title="Sign Out"
        >
          <PowerOffIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 bg-white dark:bg-slate-800 shadow-lg flex-col">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                🌐
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Acme</span>
            </div>
          </div>

          {/* Navigation */}
          {/* Use shared NavLinks component */}
          <NavLinks />

          {/* User Section */}
          <div className="border-t border-gray-200 dark:border-slate-700 p-4 space-y-4">
            <div className="text-xs text-gray-600 dark:text-gray-400 px-4 truncate">
              {userEmail}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
            >
              <PowerOffIcon className="w-6 h-6" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-lg">
        <div className="flex justify-around items-center h-20">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center w-1/4 h-full text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
            title="Home"
          >
            <span className="text-2xl">🏠</span>
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link
            href="/dashboard/invoices"
            className="flex flex-col items-center justify-center w-1/4 h-full text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
            title="Invoices"
          >
            <span className="text-2xl">📄</span>
            <span className="text-xs mt-1">Invoices</span>
          </Link>

          <Link
            href="/dashboard/invoices"
            className="flex flex-col items-center justify-center w-1/4 h-full text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
            title="Customers"
          >
            <span className="text-2xl">👥</span>
            <span className="text-xs mt-1">Customers</span>
          </Link>

          <button
            className="flex flex-col items-center justify-center w-1/4 h-full text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
            title="More"
          >
            <span className="text-2xl">⋯</span>
            <span className="text-xs mt-1">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
