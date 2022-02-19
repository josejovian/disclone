export function getColor(str) {
	if(str === undefined || str === null)
		return;

	while(str.length < 6) {
		str += str; 
	}

	let res = [100, 100, 100];
	
	for(let i = 0; i < 3; i++) {
		const idx = 2*i + 1;
		const sign = ((i + str.length) % 2 !== 0) ? -1 : 1;
		res[i] += sign*(str.charCodeAt(idx - 1) + str.charCodeAt(idx)) % 80;
	}

	return `rgb(${res[0]},${res[1]},${res[2]})`;
}

export default function getInitials(str) {
	if(str === undefined || str === null)
		return;

	let initials = "";

	str = str.toUpperCase();

	initials += str[0];

	let space = false;
	for (let i = 1; i < str.length && initials.length < 2; i++) {
		if (str[i] == " ") space = true;
		else if (space == true) {
			initials += str[i];
			space = false;
		}
	}

	return initials;
}
