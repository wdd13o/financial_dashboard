"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewInvoicePage() {
  const [formData, setFormData] = useState({
    clientName: "",
    amount: "",
    status: "pending" as const,
    dueDate: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData.clientName || !formData.amount || !formData.dueDate) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      const invoice = {
        id: "invoice-" + Date.now(),
        clientName: formData.clientName,
        amount: parseFloat(formData.amount),
        status: formData.status,
        dueDate: formData.dueDate,
        description: formData.description,
      };

      // persist via helper so other pages get notified
      const existing = JSON.parse(localStorage.getItem("invoices") || "[]");
      const updated = [...existing, invoice];
      // lazy import to avoid SSR issues
      const { saveInvoices } = await import("../../../lib/localStorageHelpers");
      saveInvoices(updated);

      router.push("/dashboard/invoices");
    } catch (err) {
      setError("Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/invoices" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Invoices
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Invoice
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount ($) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter invoice description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-6 bg-transparent text-white-600 hover:bg-white-50 disabled:text-blue-300 disabled:opacity-60 font-semibold rounded-lg transition-colors"
            >
              {isLoading ? "Creating..." : "Create Invoice"}
            </button>
            <Link
              href="/dashboard/invoices"
              className="flex-1 py-3 px-6 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white font-semibold rounded-lg text-center hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
