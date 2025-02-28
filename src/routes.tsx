import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerPage from "./pages/ClientsPage";
import AccountDetailsPage from "./pages/AccountDetailsPage";
import ClientAccountsPage from "./pages/ClientAccountsPage";
import DashboardPage from "./pages/DashboardPage";
import Layout from "./components/Layout";
import AccountsPage from "./pages/AccountsPage";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/accounts/:clientId" element={<ClientAccountsPage />} />
                <Route path="/account/:accountId" element={<AccountDetailsPage />} />
                </Route>
            </Routes>
        </Router>

    );
};

export  default AppRoutes;