/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, useToast } from "@chakra-ui/react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./utility/Redux";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";

import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, child, get, onValue } from "firebase/database";

import { auth, db, fetchData } from "./utility/Firebase";
import Login from "./pages/Login";
import { showErrorToast } from "./utility/ShowToast";

import ChatRoom from "./pages/ChatRoom";
import Register from "./pages/Register";

/* -------------------------------------------------------------------------- */
/*                             Main App Component                             */
/* -------------------------------------------------------------------------- */

const App = ({
  chats,
  uid,
  channel,
  channels,
  channelUsers,
  setChannel,
  downloadChannel,
  chatChannel,
  usersChannel,
  user,
  login,
  logout,
}) => {
  const [init, setInit] = useState(false);
  const [init_2, setInit_2] = useState(false);
  const [logged, setLogged] = useState(false);

  const toast = useToast();
  const toastIdRef = React.useRef();
  const history = useNavigate();

  // Force dark mode, I can't figure out the Chakra UI method to do this.
  if (localStorage.getItem("chakra-ui-color-mode") !== "dark") {
    localStorage.setItem("chakra-ui-color-mode", "dark");
    history("/");
  }

  const getChannels = useCallback(() => {
    onValue(ref(db, `channel/`), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        downloadChannel(data);
      }
    });
    setInit(true);
  }, [downloadChannel]);

  const initialize = useCallback(async () => {
    if (init || user === null) return;

    let rawData = await fetchData(`channel/`);
    downloadChannel(rawData);
    setChannel(0);

    await initialize();
    getChannels();
  }, [downloadChannel, getChannels, init, setChannel, user]);

  const handleSwitchChannelData = useCallback(async () => {
    if (!channel || !channels || !channels[channel]) {
      return;
    }

    onValue(ref(db, `message/${channel}/`), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        chatChannel(Object.values(data));
      }
    });

    let members = channels[channel].member;
    let memberOfChannel = {};

    for await (const [memberId, status] of Object.entries(members)) {
      let rawData = await fetchData(`user/${memberId}/`);
      if (rawData !== null) {
        memberOfChannel = {
          ...memberOfChannel,
          [memberId]: rawData,
        };
        memberOfChannel[memberId] = rawData;
      }
    }

    const stringified = JSON.stringify(memberOfChannel);
    usersChannel(stringified);
  }, [channel, channels, chatChannel, usersChannel]);

  useEffect(() => {
    handleSwitchChannelData();
  }, [channel, channels, handleSwitchChannelData]);

  /* --------------------- Authentication Functionalities --------------------- */

  /* Reference:
   * https://stackoverflow.com/a/69869761
   */
  const PrivateRoute = useMemo(() => {
    let ls_user = localStorage.getItem("disclone-user");
    let ls_uid = localStorage.getItem("disclone-uid");

    if (user === null && ls_uid !== null) {
      login(JSON.parse(ls_user), ls_uid);
    }

    return ls_user ? <Outlet /> : <Navigate to="/login" />;
  }, [login, user]);

  useEffect(() => {
    auth.onAuthStateChanged((c_user) => {
      if (logged && c_user !== null) return;
      if (!logged && c_user !== null) {
        get(child(ref(db), `user/${c_user.uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              login(snapshot.val(), c_user.uid);
              setLogged(true);
            }
          })
          .catch((error) => {
            showErrorToast(toast, toastIdRef);
          });
      }
    });
  }, [user, uid, login, logged, toast]);

  return (
    <Box className="App">
      <Routes>
        <Route exact path="/" element={<PrivateRoute />}>
          <Route exact path="/" element={<ChatRoom />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Box>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
