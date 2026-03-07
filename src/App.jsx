import { Route, Routes } from "react-router-dom";
import "./app.css";

import Auth from "./pages/Auth/page";
import Main from "./pages/Main/page";
import OtpVerify from "./pages/OTP/page";

import IsLogedin from "./components/custom/isLogedin";
import Feed from "./components/feed/feed";
import Stories from "./pages/Stories/page";
import UserProfile from "./components/profile/profile";
import Search from "./components/search/search";
import Activity from "./components/activity/activity";

export default function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Main>
              <Feed />
            </Main>
          }
        />
        <Route
          path="/search"
          element={
            <Main>
              <Search />
            </Main>
          }
        />
        <Route
          path="/activity"
          element={
            <Main>
              <Activity />
            </Main>
          }
        />
        <Route
          path="/user/:id"
          element={
            <Main>
              <UserProfile />
            </Main>
          }
        />
        <Route
          path="/auth"
          element={
            <IsLogedin>
              <Auth />
            </IsLogedin>
          }
        />
        <Route
          path="/otpverify"
          element={
            <IsLogedin>
              <OtpVerify />
            </IsLogedin>
          }
        />
      </Routes>
    </div>
  );
}
