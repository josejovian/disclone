export function showToast(
	toast,
	toastIdRef,
	title,
	description,
	status,
	duration,
	isClosable
) {
	function closeToast() {
		toast.close(toastIdRef.current);
	}

	closeToast();
	toastIdRef.current = toast({
		title: title,
		description: description,
		status: status,
		duration: duration,
		isClosable: isClosable,
	});
}

export function showErrorToast(toast, toastIdRef) {
	showToast(
		toast,
		toastIdRef,
		"Something went wrong...",
		"Please try again later.",
		"error",
		2000,
		true
	);
}
