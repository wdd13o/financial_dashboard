type Invoice = {
  id: string;
  clientName: string;
  amount: number;
  status?: string;
  dueDate?: string;
  description?: string;
};

const KEY = "invoices";

export function readInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch (err) {
    console.error("readInvoices: failed to parse invoices", err);
    return [];
  }
}

export function saveInvoices(invoices: Invoice[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(invoices));
    // Dispatch a cross-window/event notification so same-tab listeners can react
    try {
      const ev = new CustomEvent("invoicesUpdated", { detail: { invoices } });
      window.dispatchEvent(ev);
    } catch (e) {
      // ignore dispatch errors
      console.warn("saveInvoices: failed to dispatch invoicesUpdated", e);
    }
  } catch (err) {
    console.error("saveInvoices: failed to write invoices", err);
  }
}

export function notifyInvoicesUpdated() {
  if (typeof window === "undefined") return;
  try {
    const ev = new CustomEvent("invoicesUpdated", { detail: { invoices: readInvoices() } });
    window.dispatchEvent(ev);
  } catch (err) {
    console.warn("notifyInvoicesUpdated failed", err);
  }
}
