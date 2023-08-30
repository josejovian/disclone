import {
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Field, useFormikContext } from "formik";
import { useCallback } from "react";

export const FormInput = ({ name, display, type }) => {
  const { setFieldValue } = useFormikContext();

  const renderInput = useCallback(
    (field, form) =>
      type === "textarea" ? (
        <Textarea
          {...field}
          id={name}
          placeholder={display}
          autoComplete="off"
          size="md"
          maxHeight="10rem"
          color="white"
          isRequired
          onChange={(e) => {
            console.log("Updating");
            setFieldValue(name, e.target.value);
          }}
        />
      ) : (
        <Input
          {...field}
          id={name}
          type={type}
          placeholder={display}
          autoComplete="off"
          color="white"
          isRequired
          onChange={(e) => {
            console.log("Updating");
            setFieldValue(name, e.target.value);
          }}
        />
      ),
    [display, name, setFieldValue, type]
  );

  return (
    <Field name={name}>
      {({ field, form }) => (
        <FormControl
          marginTop="1rem"
          isInvalid={form.errors[name] && form.touched[name]}
        >
          {renderInput(field, form)}
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
