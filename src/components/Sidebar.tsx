"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Users, CreditCard, Menu, X, ChevronRight } from "lucide-react"

const Sidebar: React.FC = () => {
    const location = useLocation()
    const [isMobile, setIsMobile] = useState(false)
    const [isOpen, setIsOpen] = useState(true)

    const navItems = [
        { icon: Home, label: "Dashboard", path: "/" },
        { icon: Users, label: "Customers", path: "/customers" },
        { icon: CreditCard, label: "Accounts", path: "/accounts" },
    ]

    // Check if the screen is mobile size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth < 1024) {
                setIsOpen(false)
            } else {
                setIsOpen(true)
            }
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)
        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:static h-full z-40 transition-all duration-300 ease-in-out ${
                    isOpen ? "left-0" : "-left-72 lg:left-0"
                } ${isMobile ? "shadow-2xl" : ""}`}
            >
                <div className="h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 mb-10">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                            BankSystem
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2 flex-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                                        isActive ? "bg-primary text-primary-foreground font-medium" : "text-gray-300 hover:bg-white/10"
                                    }`}
                                    onClick={() => isMobile && setIsOpen(false)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon
                                            className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-gray-400 group-hover:text-white"}`}
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                    {isActive && <ChevronRight className="h-4 w-4 text-primary-foreground" />}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="pt-4 mt-6 border-t border-gray-700">
                        <div className="text-xs text-gray-400 text-center">
                            <p>© 2025 BankSystem</p>
                            <p className="mt-1">All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} aria-hidden="true" />
            )}
        </>
    )
}

export default Sidebar

