import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import Spinner from "../components/ui/Spinner";

export default function ProtectedRoute() {
  const { user, bootstrapped } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!bootstrapped) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
