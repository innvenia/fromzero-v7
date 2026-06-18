import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@fw/lib/utils";
import { Button } from "./button";

export type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
};

export function Modal({ open, title, description, onClose, footer, className, children, ...props }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fz-modal-layer" role="presentation">
      <button className="fz-modal-backdrop" type="button" aria-label="Cerrar modal" onClick={onClose} />
      <section className={cn("fz-modal", className)} role="dialog" aria-modal="true" aria-label={String(title)} {...props}>
        <div className="fz-modal-head">
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
          {onClose ? (
            <Button type="button" variant="ghost" className="btn-icon" aria-label="Cerrar" onClick={onClose}>
              <X size={16} />
            </Button>
          ) : null}
        </div>
        <div className="fz-modal-body">{children}</div>
        {footer ? <div className="fz-modal-foot">{footer}</div> : null}
      </section>
    </div>
  );
}

export type DrawerSize = "narrow" | "wide";

const drawerSizeWidth: Record<DrawerSize, string> = {
  narrow: "var(--drawer-narrow-w)",
  wide: "var(--drawer-wide-w)",
};

export type DrawerProps = React.HTMLAttributes<HTMLElement> & {
  open: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  /** Ancho semántico del Side Panel: narrow = parámetros/info (400px), wide = registros/formularios (75vw). Default: narrow. */
  size?: DrawerSize;
  /** Override de ancho (px numérico o valor CSS). Tiene prioridad sobre size. */
  width?: number | string;
};

export function Drawer({ open, title, description, onClose, size = "narrow", width, className, children, ...props }: DrawerProps) {
  if (!open) return null;

  const resolvedWidth = width ?? drawerSizeWidth[size];

  return (
    <>
      <button className="fz-drawer-backdrop" type="button" aria-label="Cerrar drawer" onClick={onClose} />
      <aside
        className={cn("fz-drawer", className)}
        role="dialog"
        aria-modal="true"
        aria-label={String(title)}
        style={{ width: resolvedWidth }}
        {...props}
      >
        <div className="fz-drawer-head">
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
          {onClose ? (
            <Button type="button" variant="ghost" className="btn-icon" aria-label="Cerrar" onClick={onClose}>
              <X size={16} />
            </Button>
          ) : null}
        </div>
        <div className="fz-drawer-body">{children}</div>
      </aside>
    </>
  );
}
