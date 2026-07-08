import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import AccountMenu from "../components/account/AccountMenu";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              T
            </div>
            <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Trello Clone
            </span>
          </Link>

          <AccountMenu />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
