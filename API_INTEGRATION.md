# API Integration Guide

This guide explains how to transition from localStorage (demo mode) to a real backend with database.

## Current Architecture (Demo Mode)

```
User Interface (React Components)
         ↓
    localStorage
         ↓
    Browser Memory
```

## Target Architecture (Production)

```
User Interface (React Components)
         ↓
    API Routes (Next.js)
         ↓
    Server Actions (Optional)
         ↓
    Database (PostgreSQL)
```

## Implementation Steps

### Step 1: Choose Your Database

**PostgreSQL (Recommended for Vercel)**
```bash
npm install @vercel/postgres
# or
npm install prisma @prisma/client
```

**Alternative Options:**
- MongoDB: `npm install mongodb mongoose`
- Firebase: `npm install firebase admin`
- Supabase: `npm install @supabase/supabase-js`

### Step 2: Set Up Database Schema

#### With Prisma (Recommended)

```bash
npm install -D prisma
npx prisma init
```

Create `prisma/schema.prisma`:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  invoices  Invoice[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Invoice {
  id          String   @id @default(cuid())
  clientName  String
  amount      Float
  status      String   @default("pending") // pending | paid | overdue
  dueDate     DateTime
  description String?
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

### Step 3: Implement Server Actions

Replace the mock functions in `app/actions/invoices.ts`:

```typescript
// app/actions/invoices.ts
"use server";

import { prisma } from "@/lib/db";
import type { Invoice } from "@/lib/types";

export async function getInvoices(userId: string): Promise<Invoice[]> {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return invoices;
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    throw new Error("Failed to fetch invoices");
  }
}

export async function createInvoice(
  data: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
  userId: string
): Promise<Invoice> {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        userId,
        amount: parseFloat(data.amount.toString()),
      },
    });
    return invoice;
  } catch (error) {
    console.error("Failed to create invoice:", error);
    throw new Error("Failed to create invoice");
  }
}

export async function updateInvoice(
  id: string,
  data: Partial<Omit<Invoice, "id">>,
  userId: string
): Promise<Invoice> {
  try {
    const invoice = await prisma.invoice.update({
      where: { id, userId }, // Ensure user owns invoice
      data,
    });
    return invoice;
  } catch (error) {
    console.error("Failed to update invoice:", error);
    throw new Error("Failed to update invoice");
  }
}

export async function deleteInvoice(
  id: string,
  userId: string
): Promise<void> {
  try {
    await prisma.invoice.delete({
      where: { id, userId }, // Ensure user owns invoice
    });
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    throw new Error("Failed to delete invoice");
  }
}
```

### Step 4: Update Components to Use Server Actions

**Before (localStorage):**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const invoice = {
    id: "invoice-" + Date.now(),
    clientName: formData.clientName,
    amount: parseFloat(formData.amount),
    status: formData.status,
    dueDate: formData.dueDate,
    description: formData.description,
  };

  const existing = JSON.parse(localStorage.getItem("invoices") || "[]");
  const updated = [...existing, invoice];
  localStorage.setItem("invoices", JSON.stringify(updated));

  router.push("/dashboard/invoices");
};
```

**After (Server Actions):**
```typescript
"use client";

import { createInvoice } from "@/app/actions/invoices";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const userId = getUserIdFromAuth(); // Get from session
    
    await createInvoice({
      clientName: formData.clientName,
      amount: parseFloat(formData.amount),
      status: formData.status,
      dueDate: formData.dueDate,
      description: formData.description,
    }, userId);

    router.push("/dashboard/invoices");
  } catch (err) {
    setError("Failed to create invoice");
  } finally {
    setIsLoading(false);
  }
};
```

### Step 5: Implement Real Authentication

**With NextAuth.js:**

```bash
npm install next-auth
```

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Verify credentials against database
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        
        if (user && verifyPassword(credentials?.password, user.password)) {
          return { id: user.id, email: user.email };
        }
        
        return null;
      },
    }),
  ],
};

export const { handlers, auth } = NextAuth(authOptions);
```

### Step 6: Migrate LocalStorage Data

Create a migration script:

```typescript
// scripts/migrate-data.ts
import { prisma } from "@/lib/db";

async function migrateData() {
  const invoicesJson = localStorage.getItem("invoices");
  if (!invoicesJson) return;

  const invoices = JSON.parse(invoicesJson);
  const userId = "user-123"; // Get actual user ID

  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: {
        clientName: invoice.clientName,
        amount: invoice.amount,
        status: invoice.status,
        dueDate: new Date(invoice.dueDate),
        description: invoice.description,
        userId,
      },
    });
  }
}

migrateData().catch(console.error);
```

### Step 7: Environment Configuration

Create `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Setup with Vercel

### Option 1: Vercel Postgres (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a project connected to GitHub
3. Add Vercel Postgres storage
4. Environment variables are automatically configured

```bash
npm install @vercel/postgres
```

### Option 2: Self-Hosted PostgreSQL

1. Install PostgreSQL locally or use cloud provider
2. Create database: `createdb finance_db`
3. Add connection string to `.env.local`

### Option 3: Docker

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=finance_db \
  -p 5432:5432 \
  postgres:latest
```

## API Routes Alternative

Instead of Server Actions, you can create API routes:

```typescript
// app/api/invoices/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request); // Extract from session
    
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    const data = await request.json();
    
    const invoice = await prisma.invoice.create({
      data: { ...data, userId },
    });
    
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
```

Then update components to call the API:

```typescript
const response = await fetch("/api/invoices", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(invoiceData),
});

const invoice = await response.json();
```

## Testing Your Integration

### Unit Tests

```typescript
// __tests__/invoices.test.ts
import { createInvoice } from "@/app/actions/invoices";

describe("Invoice Actions", () => {
  it("should create an invoice", async () => {
    const invoice = await createInvoice({
      clientName: "Test Client",
      amount: 1000,
      status: "pending",
      dueDate: "2026-02-01",
      description: "Test",
    }, "user-123");

    expect(invoice).toHaveProperty("id");
    expect(invoice.clientName).toBe("Test Client");
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/invoices.test.ts
import { auth } from "@/app/api/auth/[...nextauth]/route";

describe("Invoice API Integration", () => {
  it("should fetch invoices for authenticated user", async () => {
    const session = await auth();
    // Test API endpoints
  });
});
```

## Performance Optimization

### 1. Add Caching

```typescript
import { cache } from "react";

export const getInvoices = cache(async (userId: string) => {
  return await prisma.invoice.findMany({
    where: { userId },
  });
});
```

### 2. Database Indexes

```prisma
model Invoice {
  // ... fields
  @@index([userId])
  @@index([status])
  @@index([dueDate])
}
```

### 3. Pagination

```typescript
export async function getInvoices(
  userId: string,
  page: number = 1,
  pageSize: number = 10
) {
  return await prisma.invoice.findMany({
    where: { userId },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
}
```

## Deployment Checklist

- [ ] Environment variables set up
- [ ] Database migrations run
- [ ] Authentication configured
- [ ] API endpoints tested
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Security headers added
- [ ] Rate limiting implemented
- [ ] HTTPS enforced
- [ ] Database backups configured

## Common Issues & Solutions

### Issue: "Cannot find module '@prisma/client'"
```bash
npm install @prisma/client
npx prisma generate
```

### Issue: "DATABASE_URL is not set"
```bash
# Create .env.local with your database URL
echo 'DATABASE_URL="postgresql://..."' > .env.local
```

### Issue: "Authentication failed"
- Check NextAuth configuration
- Verify session secret is set
- Check database user record

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)

---

This guide provides the foundation for transitioning from demo mode to a production-ready application with a real database.
