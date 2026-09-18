import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STARTING_CREDITS = 1000;

// Every Build costs exactly 500 credits.
const BUILD_CREDIT_COST = 500;

type UserData = {
  email?: string;
  credits?: number;
  createdAt?: unknown;
};

async function authenticate(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authorization.slice(7);

  return adminAuth.verifyIdToken(token);
}

/**
 * Make sure the Firebase user has a Firestore document.
 *
 * New users receive exactly 1000 credits.
 * Existing users keep their current balance.
 */
async function ensureUser(
  uid: string,
  email: string | undefined
) {
  const userRef = adminDb.collection("users").doc(uid);

  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    await userRef.create({
      email: email ?? "",
      credits: STARTING_CREDITS,
      createdAt: new Date(),
    });

    return STARTING_CREDITS;
  }

  const data = snapshot.data() as UserData;

  return Number(data?.credits ?? 0);
}

/**
 * Reserve 500 credits before starting the Build.
 *
 * This transaction prevents two simultaneous Builds
 * from spending the same credits.
 */
async function reserveCredits(
  uid: string,
  email: string | undefined
) {
  const userRef = adminDb.collection("users").doc(uid);

  const result = await adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);

    if (!snapshot.exists) {
      transaction.create(userRef, {
        email: email ?? "",
        credits: STARTING_CREDITS,
        createdAt: new Date(),
      });

      transaction.update(userRef, {
        credits: STARTING_CREDITS - BUILD_CREDIT_COST,
      });

      return {
        creditsBefore: STARTING_CREDITS,
        creditsAfter: STARTING_CREDITS - BUILD_CREDIT_COST,
      };
    }

    const data = snapshot.data() as UserData;

    const currentCredits = Number(data?.credits ?? 0);

    if (currentCredits < BUILD_CREDIT_COST) {
      throw new Error("INSUFFICIENT_CREDITS");
    }

    const remainingCredits =
      currentCredits - BUILD_CREDIT_COST;

    transaction.update(userRef, {
      credits: remainingCredits,
    });

    return {
      creditsBefore: currentCredits,
      creditsAfter: remainingCredits,
    };
  });

  return result;
}

/**
 * Refund the 500 credits if the AI provider fails.
 */
async function refundCredits(uid: string) {
  const userRef = adminDb.collection("users").doc(uid);

  await adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);

    if (!snapshot.exists) {
      return;
    }

    const data = snapshot.data() as UserData;

    const currentCredits = Number(data?.credits ?? 0);

    transaction.update(userRef, {
      credits: currentCredits + BUILD_CREDIT_COST,
    });
  });
}

/**
 * GROK
 */
async function callGrok(prompt: string) {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROK_API_KEY is missing in .env.local"
    );
  }

  const model =
    process.env.GROK_MODEL || "grok-4.6";

  const systemPrompt = `
You are PIXZEN's AI software builder.

The user wants you to build something from their request.

Return a complete standalone HTML document.

Requirements:
- Return ONLY HTML.
- Do not return Markdown.
- Do not wrap the answer in code fences.
- Include CSS inside <style>.
- Include JavaScript inside <script>.
- Make the result responsive.
- Make it visually polished and modern.
- The result must work when opened as a standalone HTML page.
- Do not explain the code outside the HTML.
`;

  const response = await fetch(
    "https://api.x.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(
      `Grok ${response.status}: ${raw.slice(0, 1500)}`
    );
  }

  let data: any;

  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      `Grok returned invalid JSON: ${raw.slice(0, 1500)}`
    );
  }

  const text =
    data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error(
      "Grok returned an empty response."
    );
  }

  return text;
}

/**
 * GEMINI FALLBACK
 */
async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing in .env.local"
    );
  }

  const model =
    process.env.GEMINI_MODEL ||
    "gemini-3.6-flash";

  const systemPrompt = `
You are PIXZEN's AI software builder.

Build the requested project.

Return ONLY a complete standalone HTML document.

Requirements:
- No Markdown.
- No code fences.
- Include CSS inside <style>.
- Include JavaScript inside <script>.
- Responsive design.
- Modern premium UI.
- Everything must work in one standalone HTML file.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  systemPrompt +
                  "\n\nUSER REQUEST:\n" +
                  prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      }),
    }
  );

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(
      `Gemini ${response.status}: ${raw.slice(0, 1500)}`
    );
  }

  let data: any;

  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      `Gemini returned invalid JSON: ${raw.slice(0, 1500)}`
    );
  }

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part: any) => part?.text || "")
      .join("")
      .trim();

  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  return text;
}

/**
 * Extract HTML from an AI response.
 */
function extractHtml(text: string) {
  let html = text.trim();

  // Remove Markdown code fences if provider returned them.
  html = html
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // If provider included text before <!DOCTYPE html>,
  // keep only the actual HTML document.
  const doctypeIndex = html
    .toLowerCase()
    .indexOf("<!doctype");

  if (doctypeIndex >= 0) {
    html = html.slice(doctypeIndex);
  } else {
    const htmlIndex = html
      .toLowerCase()
      .indexOf("<html");

    if (htmlIndex >= 0) {
      html = html.slice(htmlIndex);
    }
  }

  return html.trim();
}

export async function POST(request: Request) {
  let uid = "";
  let creditsReserved = false;

  try {
    /**
     * Authenticate Firebase user.
     */
    const decoded = await authenticate(request);

    uid = decoded.uid;

    /**
     * Parse request.
     */
    const body = await request.json();

    const prompt =
      typeof body?.prompt === "string"
        ? body.prompt.trim()
        : "";

    if (!prompt) {
      return NextResponse.json(
        {
          ok: false,
          error: "Prompt is required.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Make sure user exists.
     */
    await ensureUser(
      uid,
      decoded.email
    );

    /**
     * Deduct exactly 500 credits.
     */
    let creditResult;

    try {
      creditResult = await reserveCredits(
        uid,
        decoded.email
      );

      creditsReserved = true;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "INSUFFICIENT_CREDITS"
      ) {
        const userSnapshot =
          await adminDb
            .collection("users")
            .doc(uid)
            .get();

        const userData =
          userSnapshot.data() as UserData | undefined;

        const currentCredits =
          Number(userData?.credits ?? 0);

        return NextResponse.json(
          {
            ok: false,
            error:
              "Not enough credits. Please upgrade your plan.",
            code: "INSUFFICIENT_CREDITS",
            credits: currentCredits,
            required: BUILD_CREDIT_COST,
          },
          {
            status: 402,
          }
        );
      }

      throw error;
    }

    /**
     * Grok first.
     */
    let text = "";
    let provider = "";

    try {
      text = await callGrok(prompt);
      provider = "grok";
    } catch (grokError) {
      console.error(
        "[PIXZEN] Grok failed:",
        grokError
      );

      /**
       * Gemini fallback.
       */
      try {
        text = await callGemini(prompt);
        provider = "gemini";
      } catch (geminiError) {
        console.error(
          "[PIXZEN] Gemini failed:",
          geminiError
        );

        /**
         * Both providers failed.
         * Give the 500 credits back.
         */
        if (creditsReserved) {
          await refundCredits(uid);
          creditsReserved = false;
        }

        return NextResponse.json(
          {
            ok: false,
            error:
              "Both AI providers failed. Your credits have been refunded.",
            details: {
              grok:
                grokError instanceof Error
                  ? grokError.message
                  : String(grokError),
              gemini:
                geminiError instanceof Error
                  ? geminiError.message
                  : String(geminiError),
            },
          },
          {
            status: 500,
          }
        );
      }
    }

    /**
     * Convert provider response into HTML.
     */
    const html = extractHtml(text);

    /**
     * Read final balance.
     */
    const userSnapshot =
      await adminDb
        .collection("users")
        .doc(uid)
        .get();

    const userData =
      userSnapshot.data() as UserData | undefined;

    const remainingCredits =
      Number(userData?.credits ?? 0);

    return NextResponse.json({
      ok: true,
      text,
      html,
      provider,
      credits: remainingCredits,
      creditsUsed: BUILD_CREDIT_COST,
    });
  } catch (error) {
    console.error(
      "POST /api/ai:",
      error
    );

    /**
     * Safety refund if an unexpected server error
     * happens after credits were reserved.
     */
    if (uid && creditsReserved) {
      try {
        await refundCredits(uid);
      } catch (refundError) {
        console.error(
          "[PIXZEN] Credit refund failed:",
          refundError
        );
      }
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "AI request failed.",
      },
      {
        status: 500,
      }
    );
  }
}