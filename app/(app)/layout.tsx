"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOutIcon, MenuIcon, LayoutDashboardIcon, Share2Icon, UploadIcon, ImageIcon, X } from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#161920] border-r border-white/5 transform transition-transform duration-300 z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-white">
              Cloud<span className="text-indigo-500">Show</span>
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {user && (
            <button onClick={() => signOut()} className="mt-auto flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group">
              <LogOutIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[#0f1115]/80 backdrop-blur-md border-b border-white/5">
          <div className="px-6 h-20 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white">
              <MenuIcon className="w-6 h-6" />
            </button>

            <div className="ml-auto flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3 bg-white/5 py-1.5 pl-4 pr-1.5 rounded-full border border-white/10">
                  <span className="text-sm font-medium hidden sm:inline text-gray-300">{user.username || "Account"}</span>
                  <img src={user.imageUrl} className="w-8 h-8 rounded-full ring-2 ring-indigo-500/50" alt="avatar" />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}