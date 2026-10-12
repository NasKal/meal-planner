import { useEffect, useRef, type ReactNode } from 'react';

/** Φύλλο από κάτω (native <dialog>): κλείνει με Esc, με πάτημα στο φόντο ή με το κουμπί. */
export function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="sheet-body">
        <div className="sheet-head">
          <h2>{title}</h2>
          <button type="button" className="text-btn" onClick={onClose}>
            Κλείσιμο
          </button>
        </div>
        {open && children}
      </div>
    </dialog>
  );
}
