"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  description: string;
}

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const [formData, setFormData] = useState<Invoice | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(true);

  useEffect(() => {
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    const invoice = invoices.find((inv: Invoice) => inv.id === invoiceId);
    if (invoice) {
      setFormData(invoice);
    } else {
      setError("Invoice not found");
    }
    setIsLoadingInvoice(false);
  }, [invoiceId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData((prev) => ({
        ...prev!,
        [name]: name === "amount" ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData?.clientName || !formData?.amount || !formData?.dueDate) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      const existing = JSON.parse(localStorage.getItem("invoices") || "[]");
      const updated = existing.map((inv: Invoice) => (inv.id === invoiceId ? formData : inv));
      const { saveInvoices } = await import("../../../lib/localStorageHelpers");
      saveInvoices(updated);

      router.push("/dashboard/invoices");
    } catch (err) {
      setError("Failed to update invoice");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingInvoice) {
    return <div className="text-center py-8">Loading invoice...</div>;
  }

  if (!formData) {
    return (
      <div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          {error}
        </div>
        <Link href="/dashboard/invoices" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          ← Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/invoices" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Invoices
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Invoice
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
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              {isLoading ? "Saving..." : "Save Changes"}
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
