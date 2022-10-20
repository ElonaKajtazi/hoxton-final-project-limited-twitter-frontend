import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { PageNotFound } from "./pages/NotFound";
import { Profile } from "./pages/Profile";
import { SignedOutLandingPage } from "./pages/SignedOutLandingPage";
import { SignedInLandingPage } from "./pages/SingedInLandingPage";
import { SingleTweetPage } from "./pages/SingleTweetPage";
import { DataType, UserType } from "./types";

function App() {
  const [currentUser, setCurrentUser] = useState<null | UserType>(null);
  const [error, setError] = useState<null | Array<string>>();
  const [search, setSearch] = useState<UserType[] | null>(null);

  useEffect(() => {
    if (localStorage.token) {
      fetch("http://localhost:4443/validate", {
        headers: {
          Authorization: localStorage.token,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.errors) {
            setError(data.errors);
          } else {
            signIn(data);
          }
        });
    }
  }, []);
  function signIn(data: DataType) {
    setCurrentUser(data.user);
    localStorage.token = data.token;
  }

  function signOut() {
    setCurrentUser(null);
    localStorage.removeItem("token");
  }
  console.log(currentUser);
  return (
    <div className="App">
      <Routes>
        <Route index element={<Navigate to="/home" />} />
        <Route
          path="/home"
          element={
            currentUser ? (
              <SignedInLandingPage
                currentUser={currentUser}
                signOut={signOut}
                search={search}
                setSearch={setSearch}
              />
            ) : (
              <SignedOutLandingPage signIn={signIn} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            currentUser ? (
              <Profile
                setCurrentUser={setCurrentUser}
                search={search}
                setSearch={setSearch}
                signOut={signOut}
                currentUser={currentUser}
              />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/tweet/:id"
          element={
            <SingleTweetPage
            currentUser={currentUser}
              signOut={signOut}
              search={search}
              setSearch={setSearch}
            />
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
