import { useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Spinner from "../../components/ui/Spinner";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProfile } from "../../features/auth/authSlice";
import { getInitials } from "../../utils/getInitials";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Your profile
          </h1>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                {getInitials(user.name)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {user.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                user.isVerified
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              }`}
            >
              {user.isVerified ? "Verified account" : "Unverified account"}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 dark:border-slate-700">
            <div>
              <dt className="text-xs font-medium tracking-wide text-slate-400 uppercase dark:text-slate-500">
                Member since
              </dt>
              <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {formatDate(user.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-slate-400 uppercase dark:text-slate-500">
                Last updated
              </dt>
              <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {formatDate(user.updatedAt)}
              </dd>
            </div>
          </dl>

          {status === "loading" && (
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              Refreshing profile...
            </p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
