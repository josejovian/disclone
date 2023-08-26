import { useRef, useCallback, useMemo, useEffect } from "react";
import { Text, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthLayout, AuthRegisterForm } from "../components";
import { useUser } from "../hooks";
import { showToast, showErrorToast, writeData, auth } from "../utility";

export function Register() {
  const toast = useToast();
  const toastIdRef = useRef();
  const [user, setUser] = useUser();
  const history = useNavigate();

  const onGetCredentials = useCallback(
    (data, cred) => {
      const userData = {
        name: data.name,
        role: "member",
        isMuted: false,
      };
      writeData(`user/${cred.user.uid}`, userData);
      setUser({
        ...userData,
        id: cred.user.uid,
      });
    },
    [setUser]
  );

  const onSuccess = useCallback(
    (result) => {
      if (result === null) {
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
    [history, toast]
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

  useEffect(() => {
    if (user) history("/");
  }, [history, user]);

  return (
    <AuthLayout>
      {renderAuthHeader}
      <AuthRegisterForm onSubmit={handleRegisterAccount} />
    </AuthLayout>
  );
}
