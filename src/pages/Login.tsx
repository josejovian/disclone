import { useCallback, useEffect, useMemo, useRef } from "react";
import { Text, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthLayout, AuthLoginForm } from "../components";
import { showToast, showErrorToast, auth, fetchData } from "../utility";
import { useUser } from "../hooks";

export function Login() {
  const toast = useToast();
  const toastIdRef = useRef();
  const history = useNavigate();
  const [user, setUser] = useUser();

  const handleLoginAccount = useCallback(
    async (data) => {
      let result = null;

      console.log(data);

      await signInWithEmailAndPassword(auth, data.email, data.password)
        .then(async (u) => {
          history("/");
          const userData = await fetchData(`user/${u.user.uid}`);
          setUser({
            ...userData,
            id: u.user.uid,
          });
          showToast(
            toast,
            toastIdRef,
            "Login successful!",
            "Welcome to Disclone!",
            "success",
            2000,
            true
          );
        })
        .catch((error) => {
          result = error;
          console.log(error);

          showErrorToast(toast, toastIdRef);
        });
      return result;
    },
    [history, setUser, toast]
  );

  const renderAuthHeader = useMemo(
    () => (
      <>
        <Text fontSize="xl" fontWeight="bold" textAlign="center" color="white">
          Login
        </Text>
        <Text
          fontSize="md"
          textAlign="center"
          marginBottom="2rem"
          color="white"
        >
          Don't have account?{" "}
          <Link to="/register">
            <u>Sign Up</u>
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
      <AuthLoginForm onSubmit={handleLoginAccount} />
    </AuthLayout>
  );
}
