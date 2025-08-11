"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import {
  Home,
  Users,
  AlertTriangle,
  Search,
  Car,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: Users },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Lost & Found", href: "/lost-found", icon: Search },
  { name: "Parking", href: "/parking", icon: Car },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1",
                isActive && "text-orange-600"
              )} />
              <span className={cn(
                "text-xs",
                isActive ? "font-medium" : "font-normal"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}