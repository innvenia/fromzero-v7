import { z } from "zod";

export const emailTemplateVariableSchema = z.object({
  name: z.string().check(z.regex(/^[a-z][a-z0-9_]*$/)),
  type: z.enum(["string", "number", "boolean", "date", "url"]),
  required: z.boolean()
});

export const emailTemplateRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid().nullable(),
  code: z.string().check(z.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).max(100),
  name: z.string().min(1).max(200),
  subject: z.string().min(1).max(300),
  body_html: z.string().min(1),
  body_text: z.string().nullable(),
  variables: z.array(emailTemplateVariableSchema),
  is_active: z.boolean(),
  is_system: z.boolean(),
  locale: z.string().check(z.regex(/^[a-z]{2}(?:-[A-Z]{2})?$/))
});

export type EmailTemplateVariable = z.infer<typeof emailTemplateVariableSchema>;
export type EmailTemplateRecord = z.infer<typeof emailTemplateRecordSchema>;

export function resolveEmailTemplate(input: {
  templates: readonly EmailTemplateRecord[];
  code: string;
  tenantId: string;
  locale: string;
}): EmailTemplateRecord {
  const templates = input.templates.map((template) => emailTemplateRecordSchema.parse(template))
    .filter((template) => template.code === input.code && template.is_active);

  const tenantTemplate = templates.find((template) =>
    template.tenant_id === input.tenantId && template.locale === input.locale
  );

  if (tenantTemplate) {
    return tenantTemplate;
  }

  const globalTemplate = templates.find((template) =>
    template.tenant_id === null && template.locale === input.locale
  );

  if (globalTemplate) {
    return globalTemplate;
  }

  throw new Error("Email template not found.");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stringifyTemplateValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  throw new Error("Email template variables must render to scalar values.");
}

function renderTemplateString(input: {
  template: string;
  variables: readonly EmailTemplateVariable[];
  data: Record<string, unknown>;
  escape: boolean;
}): string {
  for (const variable of input.variables) {
    if (variable.required && !Object.hasOwn(input.data, variable.name)) {
      throw new Error(`Missing required email template variable: ${variable.name}.`);
    }
  }

  return input.template.replaceAll(/\{\{\s*([a-z][a-z0-9_]*)\s*\}\}/g, (_match, variableName: string) => {
    const variable = input.variables.find((candidate) => candidate.name === variableName);

    if (!variable) {
      throw new Error(`Unknown email template variable: ${variableName}.`);
    }

    const renderedValue = stringifyTemplateValue(input.data[variableName]);

    return input.escape ? escapeHtml(renderedValue) : renderedValue;
  });
}

export function renderEmailTemplate(input: {
  template: EmailTemplateRecord;
  data: Record<string, unknown>;
}): {
  subject: string;
  html: string;
  text: string | null;
} {
  const template = emailTemplateRecordSchema.parse(input.template);

  return {
    subject: renderTemplateString({
      template: template.subject,
      variables: template.variables,
      data: input.data,
      escape: false
    }),
    html: renderTemplateString({
      template: template.body_html,
      variables: template.variables,
      data: input.data,
      escape: true
    }),
    text: template.body_text
      ? renderTemplateString({
        template: template.body_text,
        variables: template.variables,
        data: input.data,
        escape: false
      })
      : null
  };
}
