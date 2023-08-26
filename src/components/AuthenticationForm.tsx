/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Button, Text } from "@chakra-ui/react";

import { Formik, Form } from "formik";

import { ValidationInput, validateWithRules } from "../utility/Validation";
import { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*                A box that contains the register/login Form.                */
/* -------------------------------------------------------------------------- */

interface AuthenticationFormProps {
  actionName: "login" | "register";
  actionFunction: (values: any) => void;
}

export function AuthenticationForm({
  actionName,
  actionFunction,
}: AuthenticationFormProps) {
  const validateManager = useMemo(
    () => ({
      email: (value: any) => {
        return validateWithRules(columnRules, "E-mail", "email", value);
      },
      name: (value: any) => {
        return validateWithRules(columnRules, "Display Name", "name", value);
      },
      password: (value: any) => {
        return validateWithRules(columnRules, "Password", "password", value);
      },
    }),
    []
  );

  const nameElement = useMemo(
    () =>
      actionName === "login" ? (
        <></>
      ) : (
        <ValidationInput
          validateManager={validateManager}
          name="name"
          display="Display Name"
          type="text"
        />
      ),
    [actionName, validateManager]
  );

  const initialValues = useMemo(
    () =>
      actionName === "login"
        ? { email: "", password: "" }
        : { email: "", name: "", password: "" },
    [actionName]
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, actions) => {
        actionFunction(values);
        actions.setSubmitting(false);
      }}
    >
      {(props) => (
        <Form>
          <ValidationInput
            validateManager={validateManager}
            name="email"
            display="Email"
            type="email"
          />
          {nameElement}
          <ValidationInput
            validateManager={validateManager}
            name="password"
            display="Password"
            type="password"
          />
          <Button
            colorScheme="blue"
            isLoading={props.isSubmitting}
            type="submit"
            width="100%"
            marginTop="1rem"
          >
            {actionName}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

const columnRules = {
  email: {
    required: true,
  },
  name: {
    required: true,
    alphanumeric: true,
  },
  password: {
    required: true,
  },
};
