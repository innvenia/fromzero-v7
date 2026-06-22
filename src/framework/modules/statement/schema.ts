import { z } from "zod";

export const statementStatusSchema = z.enum(["draft", "finalized", "paid", "voided"]);

export const statementLineItemSchema = z.object({
  subscription_id: z.uuid(),
  plan_id: z.uuid(),
  plan_code: z.string().min(1).max(50),
  description: z.string().min(1).max(300),
  quantity: z.number().positive(),
  unit_amount: z.number().nonnegative(),
  amount: z.number().nonnegative(),
  currency: z.string().length(3)
});

export const statementRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  period_start: z.iso.datetime(),
  period_end: z.iso.datetime(),
  total_amount: z.number().nonnegative(),
  currency: z.string().length(3),
  line_items: z.array(statementLineItemSchema),
  status: statementStatusSchema,
  payment_method_id: z.string().min(1).max(200).nullable(),
  generated_at: z.iso.datetime(),
  metadata: z.record(z.string(), z.unknown())
}).superRefine((statement, context) => {
  const lineTotal = statement.line_items.reduce((total, lineItem) => total + lineItem.amount, 0);

  if (Number(lineTotal.toFixed(2)) !== Number(statement.total_amount.toFixed(2))) {
    context.addIssue({
      code: "custom",
      message: "Statement total_amount must equal the sum of line item amounts."
    });
  }

  for (const lineItem of statement.line_items) {
    if (lineItem.currency !== statement.currency) {
      context.addIssue({
        code: "custom",
        message: "Statement line item currency must match statement currency."
      });
    }
  }
});

export type StatementStatus = z.infer<typeof statementStatusSchema>;
export type StatementLineItem = z.infer<typeof statementLineItemSchema>;
export type StatementRecord = z.infer<typeof statementRecordSchema>;
