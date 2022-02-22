import { ref, set, child, get } from "firebase/database";

export async function fetchData(db, link) {
	if (db === null || db === undefined) {
		return;
	}

	let promise = new Promise(function (res, rej) {
		get(child(ref(db), link))
			.then((snapshot) => {
				let data = null;
				if (snapshot.exists()) {
					data = snapshot.val();
				}
				res(data);
			})
			.catch((error) => {
				rej(error);
			});
	});

	let result = await promise;
	return result;
}

export async function writeData(db, link, data) {
	if (db === null || db === undefined) {
		return null;
	}

	let promise = new Promise(function (res, rej) {
		set(ref(db, link), data)
			.then(() => {
				res(true);
			})
			.catch(() => {
				rej(false);
			});
	});

	let result = await promise;
	return result;
}
