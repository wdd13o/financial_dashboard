# Finance Dashboard

A comprehensive financial dashboard application built with Next.js App Router, TypeScript, and Tailwind CSS.

## Features

This financial dashboard includes the following features:

### 🏠 Public Pages
- **Home Page**: Welcome page with feature highlights and call-to-action buttons
- **Authentication**: Secure login and signup pages with form validation

### 🔐 Protected Dashboard
- **Authentication**: Login required to access dashboard
- **Dashboard Overview**: View financial summary with statistics
- **Invoice Management**:
  - Create new invoices
  - View all invoices in a table format
  - Edit existing invoices
  - Delete invoices
  - Track invoice status (pending, paid, overdue)

### 🎨 Design & UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Full dark mode theme compatibility
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Navigation**: Intuitive sidebar and header navigation

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks (useState, useEffect)
- **Authentication**: Client-side session management (localStorage)
- **Data Persistence**: Browser localStorage

## Project Structure

```
app/
├── (auth)/                 # Authentication routes group
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx       # Login page
│   └── signup/
│       └── page.tsx       # Signup page
├── dashboard/              # Protected dashboard routes
│   ├── layout.tsx         # Dashboard layout with nav
│   ├── page.tsx           # Dashboard overview
│   └── invoices/
│       ├── page.tsx       # Invoices list
│       ├── new/
│       │   └── page.tsx   # Create new invoice
│       └── [id]/
│           └── page.tsx   # Edit invoice
├── components/             # Reusable components
├── lib/                    # Utilities and helpers
├── actions/                # Server actions (for future DB integration)
├── layout.tsx             # Root layout
├── page.tsx               # Home page
└── globals.css            # Global styles
```

## Getting Started

### Prerequisites
- Node.js 20.9 or later
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd "BYU/Web Full-Stack Development/finance"
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Usage

### Home Page
- View the application overview
- Access login/signup links

### Authentication
- **Login**: Use any email and password (6+ characters) in demo mode
- **Signup**: Create a new account with email and password confirmation

### Dashboard
- View financial overview with key statistics
- Navigate to invoices section

### Invoice Management
1. **Create Invoice**:
   - Click "New Invoice" button
   - Fill in client name, amount, due date, status, and description
   - Click "Create Invoice"

2. **View Invoices**:
   - See all invoices in a table with status color-coding
   - Status indicators: Pending (yellow), Paid (green), Overdue (red)

3. **Edit Invoice**:
   - Click "Edit" on any invoice row
   - Update the invoice details
   - Click "Save Changes"

4. **Delete Invoice**:
   - Click "Delete" on any invoice row
   - Invoice will be removed immediately

## Demo Credentials

For testing purposes, use the following in demo mode:
- **Email**: Any valid email format (e.g., `test@example.com`)
- **Password**: Any string with 6+ characters (e.g., `password123`)

## Data Storage

Currently, the application uses browser localStorage for data persistence. This is suitable for development and testing but should be replaced with a proper database for production use.

**Sample data structure** (stored in localStorage under key `invoices`):
```json
{
  "id": "invoice-1234567890",
  "clientName": "Client Name",
  "amount": 1000.00,
  "status": "pending",
  "dueDate": "2026-01-20",
  "description": "Invoice description"
}
```

## Future Enhancements

- [ ] Database integration (PostgreSQL with Vercel)
- [ ] Real authentication system (NextAuth.js)
- [ ] Search and pagination functionality
- [ ] Advanced filtering and sorting
- [ ] Invoice printing/PDF export
- [ ] Email notifications
- [ ] User profiles and settings
- [ ] Multi-user support
- [ ] Analytics dashboard
- [ ] Recurring invoices
- [ ] Payment tracking
- [ ] Expense management

## Available Scripts

```bash
npm run dev     # Run development server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

## Deployment

To deploy this application:

1. **Vercel** (Recommended):
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically detect Next.js and configure it
   - Deploy with one click

2. **Other Platforms**:
   - Build: `npm run build`
   - Start: `npm start`
   - Ensure Node.js 20.9+ is available

## Learning Resources

This project demonstrates:
- **App Router**: Next.js 13+ routing with file-system based routing
- **Server Components**: React Server Components by default
- **Client Components**: Using `"use client"` directive for interactivity
- **TypeScript**: Full TypeScript support throughout
- **Styling**: Tailwind CSS for utility-first styling
- **Forms**: Form handling with React hooks
- **Navigation**: Next.js Link component and useRouter hook
- **Data Management**: localStorage for client-side state

## License

MIT License - Feel free to use this project for learning and development.

## Support

If you have questions about this course or would like to provide feedback, you can:
- Check the Next.js documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
- Visit the Next.js community: [https://github.com/vercel/next.js](https://github.com/vercel/next.js)
