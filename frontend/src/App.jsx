import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import SignIn from "./components/screens/signIn/SignIn";
import SignUp from "./components/screens/signUp/SignUp";
import Home from "./components/screens/home/Home";

import ProtectedRoutes from "./utils/ProtectedRoutes";
import Dashboard from "./components/screens/dashboard/Dashboard";
import Profile from "./components/screens/profile/Profile";
import ChannelProvider from "./utils/contexts/channel/ChannelProvider";
import MessageProvider from "./utils/contexts/message/messageProvider";
import AuthProvider from "./utils/contexts/auth/AuthProvider";
import ThemeProvider from "./utils/contexts/theme/ThemeProvider";
import Channel from "./components/screens/channels/Channel";
import Contact from "./components/screens/contact/Contact";
import DmChannel from "./components/screens/dm-channels/DmChannel";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChannelProvider>
          <MessageProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<ProtectedRoutes />}>
                  <Route element={<Dashboard />} path="/dashboard" />
                  <Route element={<Profile />} path="/profile" />
                  <Route element={<Channel />} path="/channel/:channelId" />
                  <Route element={<Contact />} path="/contact/:id" />
                  <Route element = {<DmChannel/>} path="/channel/dm/:dmChannelId"/>
                </Route>

                <Route element={<SignIn />} path="/signin" />
                <Route element={<SignUp />} path="/signup" />
                <Route element={<Home />} path="/" />
              </Routes>
            </BrowserRouter>
          </MessageProvider>
        </ChannelProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
