import * as React from "react";
import { cn } from "@fw/lib/utils";

export type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
};

export function Field({ className, label, hint, error, children, ...props }: FieldProps) {
  return (
    <div className={cn("field", className)} {...props}>
      {label ? <label className="field-label">{label}</label> : null}
      {children}
      {error ? <p className="field-hint" data-tone="error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn("input", className)} {...props} />;
});

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, ...props }, ref) {
  return <select ref={ref} className={cn("select", className)} {...props} />;
});

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn("textarea", className)} {...props} />;
});
