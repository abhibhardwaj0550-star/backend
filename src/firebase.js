import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Method 1: Try to load from JSON file (for local development)
let serviceAccount;

try {
  // For local development - read from JSON file
  const serviceAccountPath = path.resolve("./src/serviceAccount.json");
  
  if (fs.existsSync(serviceAccountPath)) {
    console.log("📁 Loading Firebase config from serviceAccount.json");
    const serviceAccountFile = fs.readFileSync(serviceAccountPath, "utf8");
    serviceAccount = JSON.parse(serviceAccountFile);
  } else {
    // Method 2: Fallback to environment variables (for Render)
    console.log("📝 Loading Firebase config from environment variables");
    
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error("FIREBASE_PRIVATE_KEY is missing from environment");
    }
    
    // Clean the private key for environment variable
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      .replace(/\\n/g, '\n')
      .replace(/^"|"$/g, '');
    
    serviceAccount = {
      type: process.env.FIREBASE_TYPE || "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID || "",
      auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com"
    };
  }
  
  // Initialize Firebase only once
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin SDK initialized successfully!");
  }
  
} catch (error) {
  console.error("❌ Firebase initialization failed:", error.message);
  console.error("Full error:", error);
  throw error;
}

export default admin;