"use client";

import { useEffect, useState } from "react";

type Invoice = {
	id: string;
	clientName: string;
	amount: number;
	status: string;
	dueDate: string;
};

type Customer = {
	name: string;
	invoiceCount: number;
	totalBilled: number;
	lastInvoice?: string;
};

export default function CustomersPage() {
	const [customers, setCustomers] = useState<Customer[] | null>(null);
	const [invoices, setInvoices] = useState<Invoice[]>([]);

	useEffect(() => {
		function loadCustomers() {
			try {
				const saved = localStorage.getItem("invoices");
				if (!saved) {
					setCustomers([]);
					return;
				}

				const invoices: Invoice[] = JSON.parse(saved || "[]");

				// expose invoices for the recent invoices section
				setInvoices(invoices);

				const map = new Map<string, Customer>();

				invoices.forEach((inv) => {
					const name = inv.clientName || "(Unknown)";
					const prev = map.get(name);
					const invDate = inv.dueDate ? new Date(inv.dueDate).toISOString() : undefined;
					if (!prev) {
						map.set(name, {
							name,
							invoiceCount: 1,
							totalBilled: Number(inv.amount || 0),
							lastInvoice: invDate,
						});
					} else {
						prev.invoiceCount += 1;
						prev.totalBilled += Number(inv.amount || 0);
						if (invDate && (!prev.lastInvoice || invDate > prev.lastInvoice)) prev.lastInvoice = invDate;
					}
				});

				setCustomers(Array.from(map.values()));
			} catch (err) {
				console.error("Failed to read invoices from localStorage:", err);
				setCustomers([]);
			}
		}

		loadCustomers();

		const handler = () => loadCustomers();
		window.addEventListener("invoicesUpdated", handler as EventListener);
		window.addEventListener("storage", handler as EventListener);

		return () => {
			window.removeEventListener("invoicesUpdated", handler as EventListener);
			window.removeEventListener("storage", handler as EventListener);
		};
	}, []);

	return (
		<div className="min-h-[60vh]">
			<div className="mb-6">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Customers</h1>
				<p className="text-sm md:text-base text-gray-600 dark:text-gray-400">List of customers and their billing info.</p>
			</div>

			{/* Recent Invoices */}
			{invoices.length > 0 && (
				<div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h2>
						<div className="text-sm text-gray-600">Showing latest {Math.min(6, invoices.length)}</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200 dark:border-slate-700">
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">#</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Customer</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Amount</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{invoices.slice(0, 6).map((inv) => (
									<tr key={inv.id} className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-600 font-mono">{inv.id.slice(-6).toUpperCase()}</td>
										<td className="px-4 py-3 text-sm font-medium text-gray-900">{inv.clientName}</td>
										<td className="px-4 py-3 text-sm text-gray-900 font-semibold">${Number(inv.amount).toFixed(2)}</td>
										<td className="px-4 py-3 text-sm text-gray-600">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
										<td className="px-4 py-3 text-sm text-gray-600">{inv.status}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Customers</h2>
				</div>

				{customers === null ? (
					<div className="p-6 text-gray-600">Loading…</div>
				) : customers.length === 0 ? (
					<div className="p-6 text-gray-600">No customers yet.</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200 dark:border-slate-700">
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Invoices</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Customer</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Total Billed</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Last Invoice</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-slate-700">
								{customers.map((c) => (
									<tr key={c.name} className="hover:bg-gray-50 dark:hover:bg-slate-700">
										<td className="px-6 py-4 text-sm text-gray-600">{c.invoiceCount}</td>
										<td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{c.name}</td>
										<td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${c.totalBilled.toFixed(2)}</td>
										<td className="px-6 py-4 text-sm text-gray-600">{c.lastInvoice ? new Date(c.lastInvoice).toLocaleDateString() : "—"}</td>
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
