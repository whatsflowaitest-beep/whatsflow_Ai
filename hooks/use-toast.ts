"use client";

// Simple toast system without external dependencies.
// Uses a module-level event bus so it works from anywhere
// without needing a Provider in the component tree.

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners: Set<Listener> = new Set();

function emit() {
  const snapshot = [...toasts];
  listeners.forEach((l) => l(snapshot));
}

/**
 * Triggers a toast notification from anywhere (inside or outside React)
 */
export function toast(message: string, variant: ToastVariant = "success") {
  const id = Math.random().toString(36).slice(2);
  toasts = [{ id, message, variant }, ...toasts];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3500);
}

/**
 * Hook to provide the toast function to components
 */
export function useToast() {
  return { toast };
}

/**
 * Hook used by the Toaster component to subscribe to toast updates
 */
export function useToastStore(): {
  toasts: ToastItem[];
  subscribe: (listener: Listener) => () => void;
} {
  return {
    toasts,
    subscribe(listener: Listener) {
      listeners.add(listener);
      listener([...toasts]); // Initial update
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
