import Link from "next/link";
import RevenueChart from "./components/RevenueChart";
import ChatWidget from "./components/ChatWidget";
import Image from "next/image";
import { lusitana } from "./ui/fonts";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="bg-white dark:bg-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                💰 Finance Dashboard
              </h1>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to Finance Dashboard
          </h2>
          <p className={`${lusitana.className} text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto`}>
            Manage your invoices, track expenses, and organize your finances with our comprehensive dashboard application.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        <section id="features" className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Dashboard Overview
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get a comprehensive view of your financial data with intuitive charts and statistics.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Invoice Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create, edit, view, and delete invoices with ease. Keep all your billing organized in one place.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Secure Access
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your data is protected with authentication. Login securely to access your dashboard.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <RevenueChart months={6} />
        </section>

        <section className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12 mb-12">
          {/* Hero images: desktop and mobile */}
          <Image
            src="/hero-desktop.svg"
            width={1000}
            height={760}
            className="hidden md:block rounded-lg shadow-lg"
            alt="Screenshots of the dashboard project showing desktop version"
          />

          <Image
            src="/hero-mobile.svg"
            width={560}
            height={620}
            className="block md:hidden rounded-lg shadow-lg"
            alt="Mobile screenshots of the dashboard project"
          />
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to manage your finances?
          </h3>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Login to Dashboard
          </Link>
        </section>
      </main>
      <ChatWidget />
    </div>
  );
}
