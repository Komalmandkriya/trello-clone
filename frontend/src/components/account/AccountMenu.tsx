import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useTheme } from "../theme/themeContext";
import { useLogout } from "../../features/auth/useLogout";
import Avatar from "../ui/Avatar";

export default function AccountMenu() {
  const user = useAppSelector((state) => state.auth.user);
  const { theme, toggleTheme } = useTheme();
  const { logout, isLoggingOut } = useLogout();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="rounded-full transition-shadow hover:ring-2 hover:ring-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:hover:ring-brand-900"
      >
        <Avatar name={user?.name} url={user?.avatar?.url} size="sm" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="px-4 pt-4 pb-3">
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
              Account
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Avatar name={user?.name} url={user?.avatar?.url} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700" />

          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/60"
          >
            View full profile
          </Link>

          <div className="border-t border-slate-100 dark:border-slate-700" />

          <button
            type="button"
            role="menuitem"
            onClick={toggleTheme}
            className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/60"
          >
            <span>Theme</span>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>

          <div className="border-t border-slate-100 dark:border-slate-700" />

          <button
            type="button"
            role="menuitem"
            onClick={logout}
            disabled={isLoggingOut}
            className="block w-full px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
