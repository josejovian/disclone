import {
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "formik";
import { useCallback } from "react";

const validateValue = (rule, name, value) => {
  let error = "";

  const functionRule = {
    required: (val, params) => {
      if (!val) error = `${name} is required!`;
    },
    maxLength: (val, params) => {
      if (val.length > parseInt(params))
        error = `${name} cannot be longer than ${params} characters!`;
    },
    alphanumeric: (val, params) => {
      const regex = /^[a-zA-Z0-9_-\s]*$/;
      if (!regex.test(val)) error = `${name} must be alphanumeric!`;
    },
  };

  const validate = functionRule[rule.rule];
  validate(value, rule.params);

  let status = false;

  if (error === "") {
    status = true;
  }

  return {
    status: status,
    message: error,
  };
};

export function validateWithRules(columnRules, display, name, value) {
  let message;

  let rules = columnRules[name];
  for (const [rule, params] of Object.entries(rules)) {
    const entry = {};
    entry.rule = rule;
    entry.params = params;
    const validationStatus = validateValue(entry, display, value);
    if (validationStatus.status === false) {
      message = validationStatus.message;
      break;
    }
  }

  return message;
}

export const ValidationInput = ({ validateManager, name, display, type }) => {
  const renderInput = useCallback(
    (field) =>
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
        />
      ),
    [display, name, type]
  );

  return (
    <Field name={name} validate={validateManager[name]}>
      {({ field, form }) => (
        <FormControl
          marginTop="1rem"
          isInvalid={form.errors[name] && form.touched[name]}
        >
          {renderInput(field)}
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

export default validateValue;
