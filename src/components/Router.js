import React from "react";
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";
import HeaderMenu from "components/HeaderMenu";
import SearchBar from "./SearchBar";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      <div className="center">
        <HeaderMenu />
        <div className="container">
          {isLoggedIn && <Navigation userObj={userObj} />}
          <div className="center">
            <Routes>
              {isLoggedIn ? (
                <>
                  <Route path="/" element={<Home userObj={userObj} />} />
                  <Route
                    path="/profile"
                    element={
                      <Profile userObj={userObj} refreshUser={refreshUser} />
                    }
                  />
                </>
              ) : (
                <>
                  <Route path="/" element={<Auth />} />
                  <Route path="*" element={<Navigate replace to="/" />} />
                </>
              )}
            </Routes>
          </div>
        </div>
        <SearchBar />
      </div>
    </Router>
  );
};
export default AppRouter;
