import React, { useEffect, useState, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Box, useToast } from "@chakra-ui/react";
import { Login, ChatRoom, Register } from "./pages";
import { ContextWrapper } from "./components";
import { fetchData, showErrorToast } from "./utility";
import { UserType } from "./types";

export function App() {
  const stateUser = useState<UserType>();
  const [user, setUser] = stateUser;
  const auth = getAuth();

  const toast = useToast();
  const toastIdRef = React.useRef();

  const PrivateRoute = useMemo(
    () => (auth.currentUser || user ? <Outlet /> : <Navigate to="/login" />),
    [auth.currentUser, user]
  );

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (!authUser) return;

      console.log(authUser);

      fetchData(`user/${authUser.uid}`)
        .then((result) => {
          setUser({
            id: authUser.uid,
            name: result.name,
          });
        })
        .catch(() => {
          showErrorToast(toast, toastIdRef);
        });
    });
  }, [auth, setUser, toast]);

  return (
    <ContextWrapper stateUser={stateUser}>
      <Box className="App">
        <Routes>
          <Route path="/" element={PrivateRoute}>
            <Route path="/" element={<ChatRoom />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Box>
    </ContextWrapper>
  );
}
