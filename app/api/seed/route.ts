import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, invoices } from "@/lib/placeholder-data";

export async function GET(request: NextRequest) {
  try {
    // Verify this is a local request (optional security measure)
    // In production, you might want to remove this or add proper authentication
    const host = request.headers.get("host") || "";
    if (!host.includes("localhost") && !host.includes("127.0.0.1")) {
      return NextResponse.json(
        { error: "Seed endpoint can only be accessed locally" },
        { status: 403 }
      );
    }

    console.log("Starting database seed...");

    // Clear existing data
    console.log("Clearing existing data...");
    await db.invoice.deleteMany();
    await db.user.deleteMany();

    // Seed users
    console.log("Creating users...");
    for (const user of users) {
      await db.user.create({
        data: user,
      });
    }
    console.log(`✓ Created ${users.length} users`);

    // Seed invoices
    console.log("Creating invoices...");
    for (const invoice of invoices) {
      await db.invoice.create({
        data: invoice,
      });
    }
    console.log(`✓ Created ${invoices.length} invoices`);

    console.log("Database seeded successfully!");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      stats: {
        usersCreated: users.length,
        invoicesCreated: invoices.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
