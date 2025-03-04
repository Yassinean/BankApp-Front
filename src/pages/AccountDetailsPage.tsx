"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getAccountById, getCustomerById } from "../services/api"
import { Container, Paper, Typography, Button, Grid } from "@mui/material"
import { ArrowLeft, CreditCard, User, Mail, Wallet } from "lucide-react"

interface Account {
    id: number
    type: string
    balance: number
    clientName: string
    clientEmail: string
}

interface Customer{
    name : string,
    email:string
}

const AccountDetailsPage: React.FC = () => {
    const { accountId } = useParams<{ accountId: string }>()
    const [account, setAccount] = useState<Account | null>(null)
    const [customerInfo , setCustomerInfo] = useState<Customer>({name:'',email:''})
    const navigate = useNavigate()

    useEffect(() => {
        if (accountId) {
            fetchAccountDetails(Number.parseInt(accountId)).then(r => console.log("Account fetched"))
        }
    }, [accountId])

    const fetchAccountDetails = async (id: number) => {
        try {
            const data = await getAccountById(id)
            if(data){
                const customer = await getCustomerById(data.clientId)
                setCustomerInfo(customer)
            }
            setAccount(data)
        } catch (error) {
            console.error("Failed to fetch account details:", error)
        }
    }

    if (!account) {
        return (
            <Container maxWidth="md" className="py-12">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Container>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
            <Container maxWidth="md" className="py-12">


                <Paper className="p-8 shadow-xl rounded-xl overflow-hidden border border-border/50 backdrop-blur-sm">
                    <Typography
                        variant="h4"
                        component="h1"
                        className="mb-8 font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
                    >
                        Account Details
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CreditCard className="h-4 w-4" />
                                    <Typography variant="subtitle2">Account ID</Typography>
                                </div>
                                <Typography variant="h6" className="font-semibold">
                                    {account.id}
                                </Typography>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Wallet className="h-4 w-4" />
                                    <Typography variant="subtitle2">Account Type</Typography>
                                </div>
                                <Typography variant="h6" className="font-semibold">
                                    {account.type}
                                </Typography>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <Typography variant="subtitle2">Client Name</Typography>
                                </div>
                                <Typography variant="h6" className="font-semibold">
                                    {customerInfo.name}
                                </Typography>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <Typography variant="subtitle2">Client Email</Typography>
                                </div>
                                <Typography variant="h6" className="font-semibold">
                                {customerInfo.email}
                                </Typography>
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <div className="p-6 mt-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm">
                                <Typography variant="h6" className="text-center text-muted-foreground mb-2">
                                    Current Balance
                                </Typography>
                                <Typography variant="h3" className="text-center font-bold text-primary">
                                    €{account.balance.toFixed(2)}
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </div>
    )
}

export default AccountDetailsPage

