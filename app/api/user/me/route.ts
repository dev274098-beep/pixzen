import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STARTING_CREDITS = 1000;

async function authenticate(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authorization.slice(7);

  return adminAuth.verifyIdToken(token);
}

export async function GET(request: Request) {
  try {
    const decoded = await authenticate(request);

    const uid = decoded.uid;
    const userRef = adminDb.collection("users").doc(uid);

    await adminDb.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(userRef);

      // Give 1000 credits ONLY when the user document
      // is created for the first time.
      if (!snapshot.exists) {
        transaction.create(userRef, {
          email: decoded.email ?? "",
          credits: STARTING_CREDITS,
          createdAt: FieldValue.serverTimestamp(),
        });
      }
    });

    const snapshot = await userRef.get();
    const data = snapshot.data();

    return NextResponse.json({
      ok: true,
      email: data?.email ?? decoded.email ?? "",
      credits: Number(data?.credits ?? 0),
    });
  } catch (error) {
    console.error("GET /api/user/me:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}