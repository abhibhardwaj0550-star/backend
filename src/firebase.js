import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve("./src/serviceAccount.json");

if (!fs.existsSync(serviceAccountPath)) {
  fs.writeFileSync(serviceAccountPath, process.env.FIREBASE_ADMIN_KEY);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase initialized ✅");
export default admin;
