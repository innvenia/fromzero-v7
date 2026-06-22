import { invoiceRecordSchema, type InvoiceRecord } from "../modules/invoice";
import { statementRecordSchema, type StatementRecord } from "../modules/statement";

type BillingPdfInput =
  | {
    type: "invoice";
    tenantName: string;
    record: InvoiceRecord;
  }
  | {
    type: "statement";
    tenantName: string;
    record: StatementRecord;
  };

type BillingPdfArtifact = {
  fileName: string;
  contentType: "application/pdf";
  bytes: Uint8Array;
};

function escapePdfText(value: string) {
  let escapedValue = "";

  for (const character of value) {
    if (character === "\\" || character === "(" || character === ")") {
      escapedValue += "\\";
    }

    escapedValue += character;
  }

  return escapedValue;
}

function slugifyFilePart(value: string) {
  let slug = "";

  for (const character of value.trim().toLowerCase()) {
    const isLowercaseLetter = character >= "a" && character <= "z";
    const isDigit = character >= "0" && character <= "9";

    if (isLowercaseLetter || isDigit) {
      slug += character;
    } else if (slug.length > 0 && !slug.endsWith("-")) {
      slug += "-";
    }
  }

  return slug.endsWith("-") ? slug.slice(0, -1) : slug;
}

function buildPdfSource(title: string, lines: readonly string[]) {
  const contentLines = [
    "BT",
    "/F1 18 Tf",
    "72 760 Td",
    `(${escapePdfText(title)}) Tj`,
    "/F1 11 Tf",
    ...lines.map((line, index) => `72 ${730 - index * 20} Td (${escapePdfText(line)}) Tj`),
    "ET"
  ];
  const stream = contentLines.join("\n");

  return [
    "%PDF-1.4",
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >> endobj",
    `4 0 obj << /Length ${stream.length} >> stream`,
    stream,
    "endstream endobj",
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    "trailer << /Root 1 0 R >>",
    "%%EOF"
  ].join("\n");
}

export function buildBillingRecordPdf(input: BillingPdfInput): BillingPdfArtifact {
  if (input.type === "invoice") {
    const invoice = invoiceRecordSchema.parse(input.record);
    const pdfSource = buildPdfSource(`Invoice ${invoice.invoice_number}`, [
      `Tenant: ${input.tenantName}`,
      `Invoice: ${invoice.invoice_number}`,
      `Amount: ${invoice.currency} ${invoice.amount.toFixed(2)}`,
      `Status: ${invoice.status}`,
      `Description: ${invoice.description}`
    ]);

    return {
      fileName: `invoice-${slugifyFilePart(invoice.invoice_number)}.pdf`,
      contentType: "application/pdf",
      bytes: new TextEncoder().encode(pdfSource)
    };
  }

  const statement = statementRecordSchema.parse(input.record);
  const pdfSource = buildPdfSource(`Statement ${statement.period_start.slice(0, 10)}`, [
    `Tenant: ${input.tenantName}`,
    `Period: ${statement.period_start.slice(0, 10)} to ${statement.period_end.slice(0, 10)}`,
    `Total: ${statement.currency} ${statement.total_amount.toFixed(2)}`,
    `Status: ${statement.status}`
  ]);

  return {
    fileName: `statement-${statement.period_start.slice(0, 10)}.pdf`,
    contentType: "application/pdf",
    bytes: new TextEncoder().encode(pdfSource)
  };
}
