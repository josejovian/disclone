/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import {
  HStack,
  Button,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { Formik, Form } from "formik";
import { ValidationInput, validateWithRules } from "../utility/Validation";
import { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*                        New channel button component.                       */
/* -------------------------------------------------------------------------- */

/* TODO (?):
 * Might have to create another "Form" component that yields an entire form,
 * given "columns" of the form.
 */

const NewChannel = ({ newChannel }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const validateManager = useMemo(
    () => ({
      name: (value) => {
        return validateWithRules(columnRules, "Channel Name", "name", value);
      },
      desc: (value) => {
        return validateWithRules(
          columnRules,
          "Channel Description",
          "desc",
          value
        );
      },
    }),
    []
  );

  const renderForm = useMemo(
    () => (
      <Formik
        initialValues={{ name: "", desc: "" }}
        onSubmit={async (values, actions) => {
          newChannel(values);
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form>
            <ModalBody padding="0 1rem!important">
              <ValidationInput
                validateManager={validateManager}
                name="name"
                display="Channel Name"
                type="text"
              />
              <ValidationInput
                validateManager={validateManager}
                name="desc"
                display="Channel Description"
                type="textarea"
              />
            </ModalBody>
            <ModalFooter>
              <HStack spacing="1rem">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Create Channel
                </Button>
              </HStack>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    ),
    [newChannel, onClose, validateManager]
  );

  return (
    <>
      <IconButton
        colorScheme="gray"
        icon={<MdAdd />}
        minWidth="0"
        width="2rem"
        height="2rem"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Channel</ModalHeader>
          <ModalCloseButton />
          {renderForm}
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewChannel;

const columnRules = {
  name: {
    required: true,
    alphanumeric: true,
    maxLength: 20,
  },
  desc: {
    required: true,
    alphanumeric: true,
    maxLength: 30,
  },
};
