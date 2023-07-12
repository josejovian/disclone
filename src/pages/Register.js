import { Text, useToast } from "@chakra-ui/react";
import { useRef, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { showToast, showErrorToast } from "../utility/ShowToast";
import {
  mapStateToProps,
  mapDispatchToProps,
  writeData,
  db,
  auth,
} from "../utility";
import { AuthLayout, AuthRegisterForm } from "../components";

const Register = ({ login }) => {
  const toast = useToast();
  const toastIdRef = useRef();
  const history = useNavigate();

  const onGetCredentials = useCallback(
    (data, cred) => {
      const userData = {
        name: data.name,
        role: "member",
        isMuted: false,
      };
      writeData(`user/${cred.user.uid}`, userData);
      login(userData, cred.user.uid);
    },
    [login]
  );

  const onSuccess = useCallback(
    (result) => {
      if (result === null) {
        login(true);
        history("/");
        showToast(
          toast,
          toastIdRef,
          "Sign up successful!",
          "You are logged in automatically.",
          "success",
          2000,
          true
        );
      }
    },
    [history, login, toast]
  );

  const handleRegisterAccount = useCallback(
    async (data) => {
      let result = null;

      await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((cred) => {
          onGetCredentials(data, cred);
        })
        .catch((error) => {
          result = error;
          showErrorToast(toast, toastIdRef);
        })
        .then(() => {
          onSuccess(result);
        });
      return result;
    },
    [onSuccess, onGetCredentials, toast]
  );

  const renderAuthHeader = useMemo(
    () => (
      <>
        <Text fontSize="xl" fontWeight="bold" textAlign="center" color="white">
          Sign Up
        </Text>
        <Text
          fontSize="md"
          textAlign="center"
          marginBottom="2rem"
          color="white"
        >
          Already have an account?{" "}
          <Link to="/login">
            <u>Login</u>
          </Link>{" "}
          instead.
        </Text>
      </>
    ),
    []
  );

  return (
    <AuthLayout>
      {renderAuthHeader}
      <AuthRegisterForm onSubmit={handleRegisterAccount} />
    </AuthLayout>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
