import { NextResponse } from "next/server";

export async function GET() {
  const cid = process.env.GOOGLE_CLIENT_ID ?? "MISSING";
  const sec = process.env.GOOGLE_CLIENT_SECRET ?? "MISSING";
  const auth = process.env.NEXTAUTH_URL ?? "MISSING";
  return NextResponse.json({
    clientId: cid.slice(0, 20) + "...(" + cid.length + ")",
    hasSecret: sec !== "MISSING",
    secretLen: sec === "MISSING" ? 0 : sec.length,
    authUrl: auth,
  });
}
