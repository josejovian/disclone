import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useCallback } from "react";

export const AuthForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  title,
}) => {
  const handleSubmitForm = useCallback(
    async (values, actions) => {
      console.log("Handle Submit Form");
      console.log(values);
      onSubmit(values);
      actions.setSubmitting(false);
    },
    [onSubmit]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
      validateOnBlur
      validateOnChange
    >
      {({ isSubmitting, isValid, submitForm, errors }) => (
        <Form>
          {children}
          <Button
            colorScheme="blue"
            isLoading={isSubmitting}
            type="submit"
            width="100%"
            marginTop="1rem"
            onClick={
              isValid
                ? submitForm
                : () => {
                    console.log("Invalid");
                    console.log(errors);
                  }
            }
          >
            {title}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
