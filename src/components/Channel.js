/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Text, useToast } from "@chakra-ui/react";

import React, { useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../utility/Redux";

import { database, db, fetchData, writeData } from "../utility/Firebase";
import firebase from "firebase/compat/app";

import { getInitials, BoxedInitials } from "../utility/Initials";
import { showErrorToast } from "../utility/ShowToast";

/* -------------------------------------------------------------------------- */
/*             A component for a channel button on the right side.            */
/* -------------------------------------------------------------------------- */

/* TODO:
 * Add a placeholder channel that appears before the actual channels load.
 * At some point it worked, but some changes will have to be done to make it work again.
 */

const Channel = ({ isDummy, uid, name = "", id, setChannel }) => {
  const toast = useToast();
  const toastIdRef = React.useRef();

  const handlePrepareChannel = useCallback(async () => {
    if (isDummy || id === null) return;

    setChannel(id);

    const data = await fetchData(`channel/${id}`);
    const members = data.member;

    if (!members[uid] === undefined) return;

    database
      .ref(`channel/${id}`)
      .child(`countMember`)
      .set(firebase.database.ServerValue.increment(1))
      .then(() => {
        writeData(`channel/${id}/member/`, {
          ...members,
          [uid]: true,
        });
      })
      .catch((e) => {
        showErrorToast(toast, toastIdRef);
      });
  }, [id, isDummy, setChannel, toast, uid]);

  // This is so that the user is automatically added to Welcome channel
  // if they haven't since everyone arrives at the Welcome channel upon sign up or login.
  // if (id === 0) prepareChannel();

  return (
    <Box
      width="384px"
      display="flex"
      flexDirection="row"
      padding="0.25rem 2rem"
      marginBottom="0.5rem"
      fontFamily="Noto Sans"
      userSelect="none"
      cursor="pointer"
      onClick={handlePrepareChannel}
      _hover={{
        backgroundColor: "#3C393F",
      }}
    >
      <BoxedInitials size="2rem" color="#252329" initials={getInitials(name)} />
      <Text
        color="#BDBDBD"
        fontWeight="700"
        lineHeight="2rem"
        marginLeft="1rem"
        letterSpacing="0.2px"
      >
        {name}
      </Text>
    </Box>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
