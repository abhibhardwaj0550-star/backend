import admin from "firebase-admin";
import path from "path";

const serviceAccountPath = path.resolve("./src/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

console.log("Firebase initialized ✅");
export default admin;
