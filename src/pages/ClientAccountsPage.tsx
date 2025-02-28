"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getAccountsByClientId } from "../services/api"
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from "@mui/material"
import { Eye, ArrowLeft } from "lucide-react"

interface Account {
    id: number
    type: string
    solde: number
}

const ClientAccountsPage: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>()
    const [accounts, setAccounts] = useState<Account[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        if (clientId) {
            fetchAccounts(Number.parseInt(clientId)).then(r => console.log("Accounts fetched"))
        }
    }, [clientId])

    const fetchAccounts = async (id: number) => {
        try {
            const data = await getAccountsByClientId(id)
            setAccounts(data)
            console.log(data)
        } catch (error) {
            console.error("Failed to fetch accounts:", error)
        }
    }

    return (
        <Container maxWidth="lg" className="py-8">
            <div className="mb-6 flex items-center justify-between">
                <Button className="flex items-center gap-2" onClick={() => navigate("/customers")} variant="outlined">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Clients
                </Button>
                <Typography variant="h4" component="h1" className="font-bold">
                    Client Accounts
                </Typography>
            </div>

            <TableContainer component={Paper} className="shadow-lg">
                <Table>
                    <TableHead className="bg-primary">
                        <TableRow>
                            <TableCell className="text-primary-foreground font-bold">ID</TableCell>
                            <TableCell className="text-primary-foreground font-bold">Type</TableCell>
                            <TableCell className="text-primary-foreground font-bold">Balance</TableCell>
                            <TableCell className="text-primary-foreground font-bold">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {accounts.map((account) => (
                            <TableRow key={account.id} className="hover:bg-muted/50">
                                <TableCell>{account.id}</TableCell>
                                <TableCell>{account.type}</TableCell>
                                <TableCell>€{account.solde.toFixed(2)}</TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => navigate(`/account/${account.id}`)}
                                        className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                                    >
                                        <Eye className="h-5 w-5 text-primary" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default ClientAccountsPage

