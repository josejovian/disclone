import { getDatabase, ref, set, child, get } from "firebase/database";

export async function fetchData(db, link) {
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
				console.log(error);
				rej(error);
			});
	});

	let result = await promise;
	return result;
}