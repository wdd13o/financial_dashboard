"use client";

import Link from "next/link";
import React from "react";

const links = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/dashboard/invoices", label: "Invoices", icon: "📄" },
  { href: "/dashboard/customers", label: "Customers", icon: "👥" },
];

export default function NavLinks() {
  return (
    <nav className="flex-1 px-4 py-8 space-y-2">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <span className="text-xl">{l.icon}</span>
          <span className="font-medium">{l.label}</span>
        </Link>
      ))}
    </nav>
  );
}
