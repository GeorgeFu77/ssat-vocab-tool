"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { BookOpen, RotateCcw, Home, List, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: <Home size={18} /> },
  { href: "/study", label: "Study", icon: <BookOpen size={18} /> },
  { href: "/review", label: "Review", icon: <RotateCcw size={18} /> },
  { href: "/words", label: "Words", icon: <List size={18} /> },
  { href: "/progress", label: "Progress", icon: <BarChart3 size={18} /> },
];

export default function Navigation() {
  const pathname = usePathname();
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    fetch("/api/review/stats?userId=1")
      .then((r) => r.json())
      .then((data) => setDueCount(data.dueNow || 0))
      .catch(() => {});
  }, [pathname]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-blue-600 text-lg">
            SSAT Vocab
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {item.icon}
                {item.label}
                {item.label === "Review" && dueCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {dueCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
