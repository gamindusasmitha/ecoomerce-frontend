
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage";
import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/registerPage";
import AdminPage from "../pages/adminPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import ForgetPasswordPage from "../pages/forgetPasswordPage";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider
        clientId="719299906421-rsc64go64dnvugb6kp1f0qgigbc9po8i.apps.googleusercontent.com"
      >
        <BrowserRouter>
          <Toaster position="top-right" />

          <div className="min-h-screen w-full bg-[var(--page-bg)] text-[var(--page-text)] transition-colors duration-300">
            <Routes>
              <Route path="/*" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
              <Route
                path="/forget-password"
                element={<ForgetPasswordPage />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
