import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { store } from "./app/store";
import { setAuthFailureHandler } from "./api/client";
import { sessionExpired } from "./features/auth/authSlice";
import { ToastProvider } from "./components/toast/ToastProvider";
import { ThemeProvider } from "./components/theme/ThemeProvider";

setAuthFailureHandler(() => {
  store.dispatch(sessionExpired());
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
