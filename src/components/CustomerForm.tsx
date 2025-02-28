"use client"

import type React from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { AlertCircle, UserPlus } from "lucide-react"

interface CustomerFormProps {
    onSubmit: (customerData: any) => void
}

const validationSchema = Yup.object({
    nom: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
})

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit }) => {
    const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
        try {
            await onSubmit(values)
            resetForm()
            // Success is handled by the parent component
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik initialValues={{ nom: "", email: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched }) => (
                <Form className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 font-serif">Create New Client</h2>

                    <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name
                        </label>
                        <Field
                            type="text"
                            id="nom"
                            name="nom"
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.nom && touched.nom ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out`}
                        />
                        <ErrorMessage name="nom">
                            {(msg) => (
                                <div className="mt-1 flex items-center text-sm text-red-600">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {msg}
                                </div>
                            )}
                        </ErrorMessage>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>
                        <Field
                            type="email"
                            id="email"
                            name="email"
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.email && touched.email ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out`}
                        />
                        <ErrorMessage name="email">
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
                        <UserPlus className="h-5 w-5 mr-2" />
                        Create Client
                    </button>
                </Form>
            )}
        </Formik>
    )
}

export default CustomerForm

