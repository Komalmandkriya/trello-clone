import DashboardLayout from "../../layouts/DashboardLayout";
import { useAppSelector } from "../../app/hooks";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Welcome back{user ? `, ${user.name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening with your account.
          </p>
        </div>

        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-600 dark:bg-slate-800/50">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Your boards
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Board, list and card management isn't available from the API yet. Once those
            endpoints ship, they'll show up here.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
