import fs from "node:fs";
import path from "node:path";

import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getCredential() {
  // Netlify / production: use environment variables
  if (process.env.NETLIFY === "true" || process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Firebase Admin environment variables are missing."
      );
    }

    return cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    });
  }

  // Local development: read the ignored service-account JSON
  const serviceAccountPath = path.join(
    process.cwd(),
    "firebase-service-account.json"
  );

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      "firebase-service-account.json not found for local Firebase Admin setup."
    );
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  );

  return cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  });
}

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: getCredential(),
      });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);