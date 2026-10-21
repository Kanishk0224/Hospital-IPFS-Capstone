'use client';

import React from 'react';
import { useApp } from './AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const iconClass =
    toast.type === 'success'
      ? 'fa-circle-check toast-success'
      : toast.type === 'error'
      ? 'fa-circle-exclamation toast-error'
      : toast.type === 'warning'
      ? 'fa-triangle-exclamation toast-warning'
      : 'fa-circle-info toast-info';

  return (
    <div className="toast-container" aria-live="polite">
      <div className={`toast toast-${toast.type}`}>
        <i className={`fa-solid ${iconClass} toast-icon`}></i>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
