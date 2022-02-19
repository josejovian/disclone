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
	FormControl,
	FormErrorMessage,
	Input,
	Textarea,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { Formik, Field, Form } from "formik";
import validateValue, {
	ValidationInput,
	validateWithRules,
} from "../utility/Validation";

const NewChannel = ({ newChannel }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

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

	const validateManager = {
		name: (value) => {
			return validateWithRules(
				columnRules,
				"Channel Name",
				"name",
				value
			);
		},
		desc: (value) => {
			return validateWithRules(
				columnRules,
				"Channel Description",
				"desc",
				value
			);
		},
	};

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
										<Button
											variant="ghost"
											onClick={onClose}
										>
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
				</ModalContent>
			</Modal>
		</>
	);
};

export default NewChannel;
