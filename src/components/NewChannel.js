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

import validateValue from "../Validation";

const NewChannel = ({ newChannel }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const NewChannelInput = ({ name, display, type }) => {
		let input = (field) => (
			<Input
				{...field}
				id={name}
				placeholder={display}
				autoComplete="off"
			/>
		);

		if (type === "textarea") {
			input = (field) => (
				<Textarea
					{...field}
					id={name}
					placeholder={display}
					autoComplete="off"
					size="md"
					maxHeight="10rem"
				/>
			);
		}

		return (
			<Field name={name} validate={validateManager[name]}>
				{({ field, form }) => (
					<FormControl
						marginTop="1rem"
						isInvalid={form.errors[name] && form.touched[name]}
					>
						{input(field)}
						<FormErrorMessage>{form.errors[name]}</FormErrorMessage>
					</FormControl>
				)}
			</Field>
		);
	};

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
			return validateWithRules("Channel Name", "name", value);
		},
		desc: (value) => {
			return validateWithRules("Channel Description", "desc", value);
		},
	};

	function validateWithRules(display, name, value) {
		let success = true,
			message;

		let rules = columnRules[name];
		for (const [rule, params] of Object.entries(rules)) {
			const entry = {};
			entry.rule = rule;
			entry.params = params;
			const validationStatus = validateValue(entry, display, value);
			if (validationStatus.status == false) {
				success = false;
				message = validationStatus.message;
				break;
			}
		}

		return message;
	}

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
									<NewChannelInput
										name="name"
										display="Channel Name"
										type="text"
									/>
									<NewChannelInput
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
