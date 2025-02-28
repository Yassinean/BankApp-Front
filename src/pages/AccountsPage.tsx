"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Plus, CreditCard, User } from "lucide-react"
import AccountForm from "../components/AccountForm";
import { getAccountsByClientId, getCustomers } from "../services/api"

interface Customer {
    id: number
    nom: string
    email: string
}
interface Account {
    id: number
    type: string
    solde: number
    clientId: number
}

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const navigate = useNavigate()

    // Fetch customers when the component mounts
    useEffect(() => {
        fetchCustomers()
    }, [])

    // Fetch accounts for all customers after the customers state is updated
    useEffect(() => {
        if (customers.length > 0) {
            fetchAllAccounts()
        }
    }, [customers])

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const data = await getCustomers()
            setCustomers(data)
        } catch (error) {
            console.error("Failed to fetch customers:", error)
        }
    }

    const fetchAllAccounts = async () => {
        try {
            setLoading(true)
            const allAccounts: Account[] = []
            for (const customer of customers) {
                const customerAccounts = await getAccountsByClientId(customer.id)
                allAccounts.push(...customerAccounts)
            }
            setAccounts(allAccounts)
        } catch (error) {
            console.error("Failed to fetch accounts:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAccountCreated = async (createdAccount: any) => {
        setIsFormVisible(false) // Hide the form
        await fetchAllAccounts() // Refresh the account list
        setSuccessMessage("Account created successfully!")
        setTimeout(() => setSuccessMessage(null), 6000)
    }

    // Find customer name by ID
    const getCustomerName = (clientId: number) => {
        const customer = customers.find((c) => c.id === clientId)
        return customer ? customer.nom : "Unknown"
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Account Management</h1>
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:bg-opacity-80 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Account
                </button>
            </div>

            {isFormVisible && (
                <div className="bg-[hsl(var(--card))] p-6 rounded-xl shadow-lg border border-[hsl(var(--border))]">
                    <AccountForm onSubmit={handleAccountCreated} />
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
                                <th className="py-2 px-4 text-left">Type</th>
                                <th className="py-2 px-4 text-left">Balance</th>
                                <th className="py-2 px-4 text-left">Client</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.map((account) => (
                                <tr key={account.id} className="hover:bg-[hsl(var(--muted))]">
                                    <td className="py-2 px-4">{account.id}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-[hsl(var(--primary))]" />
                                            {account.type}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 font-medium">€{account.solde.toFixed(2)}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-[hsl(var(--primary))]" />
                                            {getCustomerName(account.clientId)}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => navigate(`/account/${account.id}`)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))]/10 hover:bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] transition-all duration-300"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>View Details</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AccountsPage

