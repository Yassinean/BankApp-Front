"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Plus, User, Mail } from "lucide-react"
import CustomerForm from "../components/CustomerForm"
import { createCustomer, getCustomers } from "../services/api"

interface Customer {
    id: number
    name: string
    email: string
}

const ClientsPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const navigate = useNavigate()

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const data = await getCustomers()
            const customersData = data || []
            setCustomers(customersData) 
        } catch (error) {
            console.error("Failed to fetch customers:", error)
            setErrorMessage("Error fetching customers.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    const handleCreateCustomer = async (customerData: any) => {
        try {
            await createCustomer(customerData)
            await fetchCustomers()
            setIsFormVisible(false)
            setSuccessMessage("Client added successfully!")
            setTimeout(() => setSuccessMessage(null), 6000)
        } catch (error) {
            console.error("Failed to create customer:", error)
            setErrorMessage("Error creating client.")
            setTimeout(() => setErrorMessage(null), 6000)
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

            {errorMessage && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
                    <div className="flex items-center">
                        <div className="py-1">
                            <svg
                                className="fill-current h-6 w-6 text-red-500 mr-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 2a8 8 0 0 0-8 8 8 8 0 1 0 16 0 8 8 0 0 0-8-8zM9 6h2v2H9V6zm0 4h2v6H9v-6z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">{errorMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[hsl(var(--card))] p-6 rounded-xl shadow-lg border border-[hsl(var(--border))]">
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
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-2 px-4 text-center">Loading...</td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-2 px-4 text-center">No customers available</td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-[hsl(var(--muted))]">
                                        <td className="py-2 px-4">{customer.id}</td>
                                        <td className="py-2 px-4">{customer.name}</td>
                                        <td className="py-2 px-4">{customer.email}</td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => navigate(`/customer/${customer.id}`)}
                                                className="p-2 hover:bg-[hsl(var(--primary))] hover:bg-opacity-10 rounded-full transition-colors"
                                            >
                                                <Eye className="h-5 w-5 text-[hsl(var(--primary))]" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ClientsPage