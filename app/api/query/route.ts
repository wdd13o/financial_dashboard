import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

async function listInvoices() {
  const invoices = await db.invoice.findMany({
    where: {
      amount: 666,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return invoices.map((invoice) => ({
    amount: invoice.amount,
    name: invoice.user?.name,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const result = await listInvoices();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Query error:", error);
    return NextResponse.json(
      { error: "Failed to execute query" },
      { status: 500 }
    );
  }
}
