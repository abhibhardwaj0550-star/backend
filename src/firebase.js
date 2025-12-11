import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Resolve the path to your JSON file
const serviceAccountPath = path.resolve("./src/todo-project-8b038-firebase-adminsdk-fbsvc-7d6ac1848b.json");

// Read and parse the JSON
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
