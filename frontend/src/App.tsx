import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAppDispatch } from "./app/hooks";
import { fetchProfile, markBootstrapped } from "./features/auth/authSlice";
import { tokenStorage } from "./utils/tokenStorage";

function App() {
  const dispatch = useAppDispatch();
  console.log("App rendered");
  useEffect(() => {
    if (tokenStorage.getAccessToken()) {
      dispatch(fetchProfile());
    } else {
      dispatch(markBootstrapped());
    }
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
