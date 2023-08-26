/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, useToast } from "@chakra-ui/react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps, login } from "./utility/Redux";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";

import "firebase/database";
import "firebase/compat/database";
import { ref, child, get, onValue } from "firebase/database";

import { auth, db, fetchData } from "./utility/Firebase";
import Login from "./pages/Login";
import { showErrorToast } from "./utility/ShowToast";

import ChatRoom from "./pages/ChatRoom";
import Register from "./pages/Register";
import {
  ContextWrapper,
  USER_CONTEXT_DEFAULT,
} from "./components/ContextWrapper";

/* -------------------------------------------------------------------------- */
/*                             Main App Component                             */
/* -------------------------------------------------------------------------- */

export function App() {
  const stateUser = useState(USER_CONTEXT_DEFAULT);
  const [user, setUser] = stateUser;

  const toast = useToast();
  const toastIdRef = React.useRef();

  /* --------------------- Authentication Functionalities --------------------- */

  /* Reference:
   * https://stackoverflow.com/a/69869761
   */
  const PrivateRoute = useMemo(() => {
    let ls_user = localStorage.getItem("disclone-user");
    let ls_uid = localStorage.getItem("disclone-uid");

    if (user === null && ls_uid !== null) {
      login(JSON.parse(ls_user as any), ls_uid);
    }

    return ls_user ? <Outlet /> : <Navigate to="/login" />;
  }, [user]);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (!authUser) return;

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
  }, [setUser, toast]);

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
