// Generate Invoice PDF sederhana (tanpa library eksternal — PDF primitif minimal)
// Format: A4, teks dasar, tabel total. Cukup untuk download invoice jasa rakit.

interface InvoiceData {
  invoiceNo: string;
  date: string;
  customerName: string;
  items: { label: string; value: string }[];
  total: string;
  status: string;
}

/** Escape teks PDF (hapus karakter yang gak valid di string PDF) */
function esc(s: string): string {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[\r\n]+/g, " ");
}

/** Bangun konten halaman (objek stream) */
function buildContent(d: InvoiceData): string {
  const lines: string[] = [];
  const y0 = 800;
  let y = y0;

  const add = (text: string, size = 12, x = 50, bold = false) => {
    const font = bold ? "/F2" : "/F1";
    lines.push(`BT /F1 ${size} Tf ${x} ${y} Td (${esc(text)}) Tj ET`.replace("/F1", font));
    y -= size + 6;
  };

  add("TEKNOHUB — INVOICE JASA RAKIT PC", 18, 50, true);
  y -= 6;
  add(`No: ${d.invoiceNo}`, 10);
  add(`Tanggal: ${d.date}`, 10);
  add(`Pelanggan: ${d.customerName}`, 10);
  add(`Status: ${d.status}`, 10);
  y -= 10;
  lines.push("0.8 0.8 0.8 RG 50 " + y + " 495 1 re S");
  y -= 20;

  // Items
  for (const item of d.items) {
    add(`${item.label}: ${item.value}`, 11);
  }
  y -= 10;
  lines.push("0.8 0.8 0.8 RG 50 " + y + " 495 1 re S");
  y -= 20;
  add(`TOTAL: ${d.total}`, 14, 50, true);
  y -= 24;
  add("Terima kasih telah menggunakan TeknoHub!", 9);

  return lines.join("\n");
}

/** Bangun full PDF bytes (A4) */
export function generateInvoicePDF(d: InvoiceData): Buffer {
  const content = buildContent(d);
  const objects: string[] = [];
  let out = "%PDF-1.4\n";

  // Obj 1: Catalog
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  // Obj 2: Pages
  objects.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj");
  // Obj 3: Page
  objects.push("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj");
  // Obj 4: Font Helvetica
  objects.push("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj");
  // Obj 5: Font Helvetica-Bold
  objects.push("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj");
  // Obj 6: Contents
  const stream = content;
  objects.push(`6 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`);

  objects.forEach((obj, i) => {
    out += `${i + 1} 0 obj\n${obj.split("\n").slice(1).join("\n")}\n`;
  });

  // xref — build ulang dengan offset benar
  out = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(out, "latin1"));
    out += `${i + 1} 0 obj\n${obj.split("\n").slice(1).join("\n")}\n`;
  });
  const xrefStart = Buffer.byteLength(out, "latin1");
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((off) => {
    out += `${String(off).padStart(10, "0")} 00000 n \n`;
  });
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(out, "latin1");
}
