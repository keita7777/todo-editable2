import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkw2enWX3yfb0X0EPY9F2y3HxrivLvh6g",
  authDomain: "todo-editable.firebaseapp.com",
  projectId: "todo-editable",
  storageBucket: "todo-editable.appspot.com",
  messagingSenderId: "195224539242",
  appId: "1:195224539242:web:d9fcf195abc39e25403a13",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
