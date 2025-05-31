import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import SignIn from "./components/screens/signIn/SignIn";
import SignUp from "./components/screens/signUp/SignUp";
import Home from "./components/screens/home/Home";

import Layout from "./components/Layout";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Dashboard from "./components/screens/dashboard/Dashboard";
import Profile from "./components/screens/profile/Profile";
import AuthContext from "./utils/AuthContext";
import AuthProvider from "./utils/AuthProvider";

function App() {
  return (
    <AuthProvider>
    <Layout>
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
    </Layout>
    </AuthProvider>
  );
}

export default App;
