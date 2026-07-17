import { db } from "../firebase";
import {
  addDoc,
  doc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";

// Save user profile to Firestore after login
export const createUserProfile = async (user) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      uid: user.uid,
      displayName: user.displayName || "Anonymous",
      email: user.email,
      photoURL: user.photoURL || "",
      lastSeen: serverTimestamp(),
    },
    { merge: true }
  );
};

// Send a message 
export const sendMessage = async (message, user) => {
  if (message.trim() === "") return;
  await addDoc(collection(db, "messages"), {
    text: message,
    name: user.displayName,
    avatar: user.photoURL,
    createdAt: serverTimestamp(),
    uid: user.uid,
  });
};

// Subscribe to messages in real-time
export const subscribeToMessages = (callback) => {
  const q = query(
    collection(db, "messages"),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ ...doc.data(), id: doc.id });
    });
    callback(messages.sort((a, b) => a.createdAt - b.createdAt));
  });
};