import { getDatabase, ref, set, child, get } from "firebase/database";

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

export async function fetchRealTimeData(db, link) {
	
}

export async function writeData(db, link, data) {
	if (db === null || db === undefined) {
		return;
	}

	set(ref(db, link), data);
}
