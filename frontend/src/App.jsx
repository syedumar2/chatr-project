import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import SignIn from "./components/screens/signIn/SignIn";
import SignUp from "./components/screens/signUp/SignUp";
import Home from "./components/screens/home/Home";

import ProtectedRoutes from "./utils/ProtectedRoutes";
import Dashboard from "./components/screens/dashboard/Dashboard";
import Profile from "./components/screens/profile/Profile";

import AuthProvider from "./utils/contexts/auth/AuthProvider";
import ThemeProvider from "./utils/contexts/theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route element={<Dashboard />} path="/dashboard" />
              <Route element={<Profile />} path="/profile" />
            </Route>

            <Route element={<SignIn />} path="/signin" />
            <Route element={<SignUp />} path="/signup" />
            <Route element={<Home />} path="/" />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
