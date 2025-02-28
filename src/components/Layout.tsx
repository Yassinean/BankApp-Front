import type React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-auto p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default Layout

