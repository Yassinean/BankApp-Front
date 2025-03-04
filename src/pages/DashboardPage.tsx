import React, { useEffect, useState } from "react";
import { getCustomers, getAccountsByClientId } from "../services/api";
import { Eye, User, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface Account {
  id: number;
  type: string;
  balance: number;
  clientId: number;
}

const DashboardPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await getCustomers();
        setCustomers(customersData);

        const allAccounts: Account[] = [];
        for (const customer of customersData) {
          const customerAccounts = await getAccountsByClientId(customer.id);
          allAccounts.push(...customerAccounts);
        }
        setAccounts(allAccounts);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Customers Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Customers
            </h2>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No customers available
              </div>
            ) : (
              customers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {customer.name || "No Name"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.email}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/accounts/${customer.id}`)}
                    className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                  >
                    <Eye className="h-5 w-5 text-primary" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Accounts Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Accounts
            </h2>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No accounts available
              </div>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {account.type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Client ID: {account.clientId}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-gray-900 dark:text-white">
                      €{account.balance.toFixed(2)}
                    </p>
                    <button
                      onClick={() => navigate(`/account/${account.id}`)}
                      className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                    >
                      <Eye className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;