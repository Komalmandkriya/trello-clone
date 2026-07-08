import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { logoutUser } from "./authSlice";
import { useToast } from "../../components/toast/toastContext";

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      showToast("You have been logged out", "success");
    } finally {
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return { logout, isLoggingOut };
}
