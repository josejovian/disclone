import { ref, set, child, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
};

export const app = initializeApp(config);
export const db = getDatabase(app);
export const auth = getAuth();

export async function fetchData(link) {
  return get(child(ref(db), link)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  });
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
