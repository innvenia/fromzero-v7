import { z } from "zod";

import { moduleCodeSchema } from "../../auth/schema";

export const customFieldTypeValues = [
  "text",
  "textarea",
  "number",
  "boolean",
  "date",
  "select",
  "multi-select",
  "email",
  "url"
] as const;

export const customFieldTypeSchema = z.enum(customFieldTypeValues);

export const localizedLabelSchema = z.object({
  en: z.string().min(1),
  es: z.string().min(1)
}).catchall(z.string().min(1));

export const customFieldOptionSchema = z.object({
  value: z.string().min(1).max(100),
  labels: localizedLabelSchema
});

export const customFieldRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  entity_type: moduleCodeSchema,
  field_name: z.string().regex(/^[a-z][a-z0-9_]*$/).max(100),
  labels: localizedLabelSchema,
  field_type: customFieldTypeSchema,
  options: z.array(customFieldOptionSchema).nullable(),
  is_required: z.boolean(),
  is_filterable: z.boolean(),
  default_value: z.unknown().nullable(),
  sort_order: z.number().int().nullable(),
  is_active: z.boolean()
}).superRefine((field, context) => {
  const options = field.options ?? [];

  if ((field.field_type === "select" || field.field_type === "multi-select") && options.length === 0) {
    context.addIssue({
      code: "custom",
      message: "Select custom fields require options."
    });
  }
});

export type CustomFieldRecord = z.infer<typeof customFieldRecordSchema>;

function validateCustomFieldValue(field: CustomFieldRecord, value: unknown): void {
  if (value === null || value === undefined) {
    return;
  }

  if (field.field_type === "number" && typeof value !== "number") {
    throw new Error("Custom field default value must be numeric.");
  }

  if (field.field_type === "boolean" && typeof value !== "boolean") {
    throw new Error("Custom field default value must be boolean.");
  }

  if (field.field_type === "email") {
    z.string().email().parse(value);
  }

  if (field.field_type === "url") {
    z.string().url().parse(value);
  }

  if (field.field_type === "date") {
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(value);
  }

  if (field.field_type === "select") {
    const values = new Set((field.options ?? []).map((option) => option.value));

    if (typeof value !== "string" || !values.has(value)) {
      throw new Error("Custom field default value is not in the select options.");
    }
  }

  if (field.field_type === "multi-select") {
    const values = new Set((field.options ?? []).map((option) => option.value));

    if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !values.has(item))) {
      throw new Error("Custom field default values are not in the select options.");
    }
  }
}

export function validateCustomFieldDefinition(
  fieldInput: CustomFieldRecord,
  allowedModuleCodes: readonly string[]
): CustomFieldRecord {
  const field = customFieldRecordSchema.parse(fieldInput);

  if (!allowedModuleCodes.includes(field.entity_type)) {
    throw new Error("Custom field module is not allowlisted.");
  }

  validateCustomFieldValue(field, field.default_value);

  return field;
}

export function assertCustomFieldLimit(currentCount: number, maxCount: number): true {
  if (currentCount >= maxCount) {
    throw new Error("Custom field limit exceeded.");
  }

  return true;
}
