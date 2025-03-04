"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createAccount, getCustomers } from "../services/api";
import { AlertCircle, CreditCard } from "lucide-react";

interface AccountFormProps {
  onSubmit?: (accountData: any) => void;
}

interface Client {
  id: number;
  name: string;
}

const validationSchema = Yup.object({
  clientId: Yup.number().required("Client ID is required"),
  type: Yup.string().required("Account type is required"),
  balance: Yup.number()
    .required("Balance is required")
    .min(0, "Balance must be positive"),
});

const AccountForm: React.FC<AccountFormProps> = ({ onSubmit }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getCustomers();
      // Assuming the clients are inside _embedded.customers
      const clientsData = data || [];
      setClients(clientsData); // Set the clients array to state
      console.log("Fetched clients:", clientsData);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setErrorMessage(null); // Clear previous errors
      const accountData = {
        clientId: Number(values.clientId),
        type: values.type,
        balance: Number(values.balance),
      };
      const createdAccount = await createAccount(accountData);
      resetForm();
      if (onSubmit) onSubmit(createdAccount); // Reset form on success
    } catch (error: any) {
      // Display the error message from the backend
      setErrorMessage(
        error.message || "An error occurred while creating the account"
      );
    } finally {
      setSubmitting(false); // Ensure the form is no longer submitting
    }
  };

  return (
    <Formik
      initialValues={{ clientId: "", type: "", balance: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 font-serif">
            Create New Account
          </h2>

          {/* Display Backend Error */}
          {errorMessage && (
            <div className="mb-4 flex items-center text-sm text-red-600 bg-red-100 p-3 rounded-md">
              <AlertCircle className="h-5 w-5 mr-2" />
              {errorMessage}
            </div>
          )}
          <div>
            <label
              htmlFor="clientId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Client
            </label>
            <Field
              as="select"
              id="clientId"
              name="clientId"
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                errors.clientId && touched.clientId
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition duration-150 ease-in-out`}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option
                  key={client.id || client.name}
                  value={client.id}
                  className="text-gray-900 dark:text-gray-300"
                >
                  {client.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="clientId">
              {(msg) => (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Account Type
            </label>
            <Field
              as="select"
              id="type"
              name="type"
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                errors.type && touched.type
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition duration-150 ease-in-out`}
            >
              <option value="">Select type</option>
              <option value="COURANT">Courant</option>
              <option value="EPARGNE">Epargne</option>
            </Field>
            <ErrorMessage name="type">
              {(msg) => (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>
          <div>
            <label
              htmlFor="balance"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Balance
            </label>
            <Field
              type="number"
              id="balance"
              name="balance"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.balance && touched.balance
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out`}
            />
            <ErrorMessage name="balance">
              {(msg) => (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Create Account
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AccountForm;
