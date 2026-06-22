import { z } from "zod";

export const invoiceStatusSchema = z.enum(["processed", "voided", "reversed"]);

export const invoiceRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  statement_id: z.uuid(),
  invoice_number: z.string().min(1).max(80),
  external_invoice_id: z.string().min(1).max(200).nullable(),
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
  description: z.string().min(1).max(500),
  status: invoiceStatusSchema,
  paid_at: z.iso.datetime().nullable(),
  voided_at: z.iso.datetime().nullable(),
  reversed_at: z.iso.datetime().nullable(),
  metadata: z.record(z.string(), z.unknown())
}).superRefine((invoice, context) => {
  if (invoice.status === "processed" && !invoice.paid_at) {
    context.addIssue({
      code: "custom",
      message: "Processed invoices require paid_at."
    });
  }

  if (invoice.status === "voided" && !invoice.voided_at) {
    context.addIssue({
      code: "custom",
      message: "Voided invoices require voided_at."
    });
  }

  if (invoice.status === "reversed" && !invoice.reversed_at) {
    context.addIssue({
      code: "custom",
      message: "Reversed invoices require reversed_at."
    });
  }
});

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;
export type InvoiceRecord = z.infer<typeof invoiceRecordSchema>;
