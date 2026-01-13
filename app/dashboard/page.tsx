"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import RevenueChart from "../components/RevenueChart";

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("invoices");
    if (saved) {
      const invoiceList = JSON.parse(saved);
      setInvoices(invoiceList);
      
      const totals = invoiceList.reduce(
        (acc: any, inv: Invoice) => {
          acc.totalAmount += inv.amount;
          if (inv.status === "paid") acc.paidAmount += inv.amount;
          if (inv.status === "pending") acc.pendingAmount += inv.amount;
          return acc;
        },
        { totalAmount: 0, paidAmount: 0, pendingAmount: 0 }
      );
      setStats(totals);
    }
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Welcome back! Here's your financial overview.</p>
        </div>

        <div className="shrink-0">
          <Link
            href="/dashboard/invoices/new"
            className="px-4 py-2 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-semibold transition-colors text-sm md:text-base text-center border border-gray-200"
          >
            <span className="mr-2">➕</span>
            Create Invoice
          </Link>
        </div>
      </div>

      {/* Stats Cards - Horizontal scroll on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8 overflow-x-auto pb-2">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 md:p-6 flex-shrink-0 min-w-full md:min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">Collected</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1 md:mt-2">
                ${stats.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-3xl md:text-4xl">✓</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 md:p-6 flex-shrink-0 min-w-full md:min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">Pending</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1 md:mt-2">
                ${stats.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-3xl md:text-4xl">⏳</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 md:p-6 flex-shrink-0 min-w-full md:min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">Total</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1 md:mt-2">
                ${stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-3xl md:text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Recent revenue chart */}
      <div className="mb-6">
        <RevenueChart months={6} />
      </div>

      {/* Recent Invoices */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row justify-between md:items-center gap-3">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Recent Invoices</h2>
          <Link
            href="/dashboard/invoices/new"
            className="px-4 py-2 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-semibold transition-colors text-sm md:text-base text-center border border-gray-200"
          >
            <span className="mr-2">➕</span>
            Create Invoice
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No invoices yet.</p>
            <Link
              href="/dashboard/invoices/new"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Create your first invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {invoices.slice(0, 6).map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {invoice.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {invoice.clientName}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : invoice.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                      >
                        ✏️
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
