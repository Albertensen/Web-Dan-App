import crypto from "crypto";

export interface MidtransConfig {
  isEnabled: boolean;
  serverKey?: string;
  clientKey?: string;
}

export interface SnapRequest {
  order_id: string;
  gross_amount: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
}

export interface MidtransNotification {
  transaction_status: string;
  order_id: string;
  gross_amount: string;
  signature_key: string;
  payment_type: string;
  fraud_status: string;
  status_code: string;
}

/** Konfigurasi Midtrans dari env. isEnabled = key server + client tersedia. */
export function getMidtransConfig(): MidtransConfig {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  return {
    isEnabled: Boolean(serverKey && clientKey),
    serverKey,
    clientKey,
  };
}

/**
 * Minta Snap Token dari Midtrans.
 * Saat Midtrans belum dikonfigurasi (feature pending), kembalikan mock token
 * agar flow checkout tetap bisa diuji end-to-end.
 */
export async function requestSnapToken(req: SnapRequest): Promise<string> {
  const config = getMidtransConfig();

  if (!config.isEnabled || !config.serverKey) {
    return `MOCK-${req.order_id}`;
  }

  const res = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(config.serverKey + ":").toString("base64")}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: req.order_id,
        gross_amount: req.gross_amount,
      },
      customer_details: {
        first_name: req.customer.name,
        phone: req.customer.phone,
        email: req.customer.email,
      },
      credit_card: { secure: true },
    }),
  });

  if (!res.ok) {
    throw new Error(`Midtrans Snap request failed: ${res.status}`);
  }

  const data = (await res.json()) as { token: string };
  return data.token;
}

/** Verifikasi signature webhook Midtrans (SHA512). */
export function verifyMidtransSignature(n: MidtransNotification, serverKey: string): boolean {
  const payload = `${n.order_id}${n.status_code}${n.gross_amount}${serverKey}`;
  const hash = crypto.createHash("sha512").update(payload).digest("hex");
  return hash === n.signature_key;
}

/** Status Midtrans yang berarti pembayaran berhasil. */
export function isPaidStatus(transactionStatus: string): boolean {
  return ["capture", "settlement"].includes(transactionStatus);
}
