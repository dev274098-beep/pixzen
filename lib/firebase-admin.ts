import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "../firebase-service-account.json";

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: serviceAccount.project_id,

          clientEmail:
            serviceAccount.client_email,

          privateKey:
            serviceAccount.private_key.replace(
              /\\n/g,
              "\n"
            ),
        }),
      });

export const adminAuth =
  getAuth(adminApp);

export const adminDb =
  getFirestore(adminApp);