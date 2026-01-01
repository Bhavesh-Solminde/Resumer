import React from "react";
import { AlertTriangle, Trash2, X, LucideIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

type DialogVariant = "danger" | "warning" | "info";

interface VariantStyle {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  confirmBg: string;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const variantStyles: Record<DialogVariant, VariantStyle> = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    confirmBg: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    confirmBg: "bg-yellow-600 hover:bg-yellow-700",
  },
  info: {
    icon: AlertTriangle,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    confirmBg: "bg-blue-600 hover:bg-blue-700",
  },
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const styles = variantStyles[variant];
  const IconComponent = styles.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Icon */}
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
              styles.iconBg
            )}
          >
            <IconComponent className={cn("w-5 h-5", styles.iconColor)} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-6">{message}</p>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors",
                  styles.confirmBg
                )}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
