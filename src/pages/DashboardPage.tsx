import type React from "react"
import { useEffect, useState } from "react"
import { getCustomers, getAccountsByClientId } from "../services/api"
import { Eye, User, CreditCard } from "lucide-react"
import { useNavigate } from "react-router-dom"

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

const DashboardPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])
    const navigate = useNavigate()

    // Fetch customers when the component mounts
    useEffect(() => {
        fetchCustomers().then(() => console.log("Customers fetched"))
    }, [])

    // Fetch accounts for all customers after the customers state is updated
    useEffect(() => {
        if (customers.length > 0) {
            fetchAllAccounts().then(() => console.log("Accounts fetched"))
        }
    }, [customers]) // This effect depends on the `customers` state

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers()
            setCustomers(Array.isArray(data) ? data : [])
            const customersData = data?._embedded?.customers || []
            setCustomers(customersData)
            console.log(data)
        } catch (error) {
            console.error("Failed to fetch customers:", error)
        }
    }

    const fetchAllAccounts = async () => {
        try {
            const allAccounts: Account[] = []
            for (const customer of customers) {
                const customerAccounts = await getAccountsByClientId(customer.id)
                allAccounts.push(...customerAccounts)
            }
            setAccounts(allAccounts)
        } catch (error) {
            console.error("Failed to fetch accounts:", error)
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Dashboard</h1>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Customers Table */}
                <div className="bg-[hsl(var(--card))] p-6 rounded-xl shadow-lg border border-[hsl(var(--border))]">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="h-6 w-6 text-[hsl(var(--primary))]" />
                        <h2 className="text-xl font-semibold">Customers</h2>
                    </div>
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
                            {Array.isArray(customers) && customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-[hsl(var(--muted))]">
                                    <td className="py-2 px-4">{customer.id}</td>
                                    <td className="py-2 px-4">{customer.nom}</td>
                                    <td className="py-2 px-4">{customer.email}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => navigate(`/accounts/${customer.id}`)}
                                            className="p-2 hover:bg-[hsl(var(--primary))] hover:bg-opacity-10 rounded-full transition-colors"
                                        >
                                            <Eye className="h-5 w-5 text-[hsl(var(--primary))]" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Accounts Table */}
                <div className="bg-[hsl(var(--card))] p-6 rounded-xl shadow-lg border border-[hsl(var(--border))]">
                    <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="h-6 w-6 text-[hsl(var(--primary))]" />
                        <h2 className="text-xl font-semibold">Accounts</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-[hsl(var(--border))]">
                                <th className="py-2 px-4 text-left">ID</th>
                                <th className="py-2 px-4 text-left">Type</th>
                                <th className="py-2 px-4 text-left">ClientID</th>
                                <th className="py-2 px-4 text-left">Balance</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.map((account) => (
                                <tr key={account.id} className="hover:bg-[hsl(var(--muted))]">
                                    <td className="py-2 px-4">{account.id}</td>
                                    <td className="py-2 px-4">{account.type}</td>
                                    <td className="py-2 px-4">{account.clientId}</td>
                                    <td className="py-2 px-4">€{account.solde.toFixed(2)}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => navigate(`/account/${account.id}`)}
                                            className="p-2 hover:bg-[hsl(var(--primary))] hover:bg-opacity-10 rounded-full transition-colors"
                                        >
                                            <Eye className="h-5 w-5 text-[hsl(var(--primary))]" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
