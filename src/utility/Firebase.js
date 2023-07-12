import { ref, set, child, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import firebase from "firebase/compat/app";
// import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

export const app = initializeApp(config);
export const db = getDatabase(app);
export const database = firebase.database();
export const auth = getAuth();

export async function fetchData(link) {
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

export async function writeData(link, data) {
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
