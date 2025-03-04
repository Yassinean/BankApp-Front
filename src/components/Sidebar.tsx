"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, CreditCard, Menu, X, ChevronRight } from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: CreditCard, label: "Accounts", path: "/accounts" },
  ];

  // Check if the screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg bg-primary text-white shadow-md hover:bg-primary/90 transition-all duration-200"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static h-full z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "left-0" : "-left-96 lg:left-0"
        } ${isMobile ? "shadow-2xl" : ""}`}
      >
        <div className="h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              BankSystem
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-primary"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-primary"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>© 2025 BankSystem</p>
              <p className="mt-1">All rights reserved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;