import {
  invoiceRecordSchema,
  type InvoiceRecord
} from "../modules/invoice";

const immutableInvoiceFields = [
  "tenant_id",
  "statement_id",
  "invoice_number",
  "external_invoice_id",
  "amount",
  "currency",
  "description",
  "paid_at"
] as const;

export function validateInvoiceMutation(currentInput: unknown, nextInput: unknown): InvoiceRecord {
  const current = invoiceRecordSchema.parse(currentInput);
  const next = invoiceRecordSchema.parse(nextInput);

  for (const field of immutableInvoiceFields) {
    if (current[field] !== next[field]) {
      throw new Error("Invoice content is immutable after issue.");
    }
  }

  return next;
}
