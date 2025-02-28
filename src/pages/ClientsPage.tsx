"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Plus, User, Mail } from "lucide-react"
import CustomerForm from "../components/CustomerForm"
import { createCustomer, getCustomers } from "../services/api"

interface Customer {
    id: number
    nom: string
    email: string
}

const ClientsPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchCustomers().then(r => console.log("Customers fetched"))
    }, [])

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const data = await getCustomers()
            console.log("Fetched customers:", data)  // Log the data to check what it is

            const customersData = data?._embedded?.customers || []
            setCustomers(customersData)
            
            // Check if the fetched data is an array
            // if (Array.isArray(data)) {
            //     setCustomers(data)
            // } else {
            //     // If it's not an array, reset to an empty array
            //     setCustomers([])
            //     console.error("Fetched data is not an array:", data)
            // }
        } catch (error) {
            console.error("Failed to fetch customers:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateCustomer = async (customerData: any) => {
        try {
            await createCustomer(customerData)
            await fetchCustomers()
            setIsFormVisible(false)
            setSuccessMessage("Client added successfully!")
            setTimeout(() => setSuccessMessage(null), 6000)
        } catch (error) {
            console.error("Failed to create customer:", error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Client Management</h1>
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:bg-opacity-80 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Client
                </button>
            </div>

            {isFormVisible && (
                <div className="bg-[hsl(var(--card))] p-6 rounded-xl shadow-lg border border-[hsl(var(--border))]">
                    <CustomerForm onSubmit={handleCreateCustomer} />
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
                    <div className="flex items-center">
                        <div className="py-1">
                            <svg
                                className="fill-current h-6 w-6 text-green-500 mr-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[hsl(var(--card))] p-6 rounded-xl shadow-lg border border-[hsl(var(--border))]">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))]"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-[hsl(var(--border))]">
                                <th className="py-2 px-4 text-left">ID</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers.length > 0 ? (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-[hsl(var(--muted))]">
                                        <td className="py-2 px-4">{customer.id}</td>
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-[hsl(var(--primary))]" />
                                                {customer.nom}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-[hsl(var(--primary))]" />
                                                {customer.email}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => navigate(`/accounts/${customer.id}`)}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))]/10 hover:bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] transition-all duration-300"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>View Accounts</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-2 px-4 text-center">No customers found</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ClientsPage
