import { useMemo } from "react";
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
import * as Yup from "yup";
import { FormInput } from "../../Form";

const NewChannelSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Channel name is too short!")
    .max(20, "Channel name is too long!")
    .required("Channel name is required!"),
  desc: Yup.string()
    .min(2, "Channel description is too short!")
    .max(50, "Channel description is too long!")
    .required("Channel description is required!"),
});

interface NewChannelProps {
  createNewChannel: (data: any) => void;
}

export function NewChannel({ createNewChannel }: NewChannelProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const renderForm = useMemo(
    () => (
      <Formik
        initialValues={{ name: "", desc: "" }}
        validationSchema={NewChannelSchema}
        onSubmit={async (values, actions) => {
          createNewChannel(values);
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form>
            <ModalBody padding="0 1rem!important">
              <FormInput name="name" display="Channel Name" type="text" />
              <FormInput
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
    [createNewChannel, onClose]
  );

  return (
    <>
      <IconButton
        aria-label="Create Channel"
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
}
