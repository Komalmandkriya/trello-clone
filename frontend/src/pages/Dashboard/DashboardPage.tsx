import { useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Spinner from "../../components/ui/Spinner";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProfile } from "../../features/auth/authSlice";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
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
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700">
                {getInitials(user.name)}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{user.name}</h1>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                user.isVerified
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {user.isVerified ? "Verified account" : "Unverified account"}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Member since
              </dt>
              <dd className="mt-1 text-sm text-slate-700">{formatDate(user.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Last updated
              </dt>
              <dd className="mt-1 text-sm text-slate-700">{formatDate(user.updatedAt)}</dd>
            </div>
          </dl>

          {status === "loading" && (
            <p className="mt-4 text-xs text-slate-400">Refreshing profile...</p>
          )}
        </section>

        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-base font-semibold text-slate-800">Your boards</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Board, list and card management isn't available from the API yet. Once those
            endpoints ship, they'll show up here.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
